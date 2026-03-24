#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { transform } from "esbuild";

const DEFAULTS = {
  srcDir: "src",
  outDir: "src-jsx",
  inPlace: false,
  dryRun: false,
  deleteSource: false,
};

function printHelp() {
  console.log(`\nConvertit des fichiers TypeScript/TSX en JS/JSX sans compiler le JSX.\n\nUsage:\n  node scripts/convert-ts-to-jsx.mjs [options]\n\nOptions:\n  --src <dir>          Dossier source (defaut: src)\n  --out <dir>          Dossier de sortie (defaut: src-jsx)\n  --in-place           Ecrit dans le dossier source (extensions .ts/.tsx -> .js/.jsx)\n  --delete-source      Supprime les fichiers TS apres conversion (utile avec --in-place)\n  --dry-run            Affiche les fichiers cibles sans ecrire sur disque\n  --help               Affiche cette aide\n\nExemples:\n  npm run convert:jsx\n  npm run convert:jsx -- --dry-run\n  npm run convert:jsx -- --src src --out src-jsx\n  npm run convert:jsx -- --in-place --delete-source\n`);
}

function parseArgs(argv) {
  const options = { ...DEFAULTS };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--src") {
      options.srcDir = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === "--out") {
      options.outDir = argv[i + 1];
      i += 1;
      continue;
    }

    if (arg === "--in-place") {
      options.inPlace = true;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--delete-source") {
      options.deleteSource = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    throw new Error(`Option inconnue: ${arg}`);
  }

  if (options.inPlace) {
    options.outDir = options.srcDir;
  }

  return options;
}

function isTypeScriptFile(fileName) {
  return /\.(ts|tsx|mts|cts)$/i.test(fileName) && !fileName.endsWith(".d.ts");
}

async function collectTypeScriptFiles(rootDir) {
  const collected = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }

      if (entry.isFile() && isTypeScriptFile(entry.name)) {
        collected.push(absolutePath);
      }
    }
  }

  await walk(rootDir);
  return collected;
}

function getOutputExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".tsx") {
    return ".jsx";
  }

  if (ext === ".mts") {
    return ".mjs";
  }

  if (ext === ".cts") {
    return ".cjs";
  }

  return ".js";
}

function rewriteSpecifier(specifier) {
  if (!specifier.startsWith(".") && !specifier.startsWith("/")) {
    return specifier;
  }

  if (specifier.endsWith(".tsx")) {
    return `${specifier.slice(0, -4)}.jsx`;
  }

  if (specifier.endsWith(".ts")) {
    return `${specifier.slice(0, -3)}.js`;
  }

  if (specifier.endsWith(".mts")) {
    return `${specifier.slice(0, -4)}.mjs`;
  }

  if (specifier.endsWith(".cts")) {
    return `${specifier.slice(0, -4)}.cjs`;
  }

  return specifier;
}

function rewriteTypeScriptImportExtensions(code) {
  const patterns = [
    /(\bfrom\s*["'])([^"']+)(["'])/g,
    /(\bimport\s*\(\s*["'])([^"']+)(["']\s*\))/g,
    /(\bimport\s*["'])([^"']+)(["'])/g,
    /(\brequire\s*\(\s*["'])([^"']+)(["']\s*\))/g,
  ];

  let output = code;

  for (const pattern of patterns) {
    output = output.replace(pattern, (match, prefix, specifier, suffix) => {
      const rewritten = rewriteSpecifier(specifier);

      if (rewritten === specifier) {
        return match;
      }

      return `${prefix}${rewritten}${suffix}`;
    });
  }

  return output;
}

async function convertSourceFile(sourceFilePath) {
  const extension = path.extname(sourceFilePath).toLowerCase();
  const loader = extension === ".tsx" ? "tsx" : "ts";

  const original = await fs.readFile(sourceFilePath, "utf8");

  const transformed = await transform(original, {
    loader,
    format: "esm",
    target: "esnext",
    jsx: "preserve",
    sourcemap: false,
    legalComments: "none",
  });

  const withFixedImports = rewriteTypeScriptImportExtensions(transformed.code);
  return `${withFixedImports.trimEnd()}\n`;
}

function resolveOutputPath(sourceFilePath, sourceRoot, outputRoot, inPlace) {
  const nextExt = getOutputExtension(sourceFilePath);
  const parsed = path.parse(sourceFilePath);

  if (inPlace) {
    return path.join(parsed.dir, `${parsed.name}${nextExt}`);
  }

  const relativePath = path.relative(sourceRoot, sourceFilePath);
  const relativeParsed = path.parse(relativePath);

  return path.join(outputRoot, relativeParsed.dir, `${relativeParsed.name}${nextExt}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (options.deleteSource && !options.inPlace) {
    throw new Error("--delete-source est possible uniquement avec --in-place");
  }

  const cwd = process.cwd();
  const sourceRoot = path.resolve(cwd, options.srcDir);
  const outputRoot = path.resolve(cwd, options.outDir);

  const sourceExists = await fs
    .stat(sourceRoot)
    .then((s) => s.isDirectory())
    .catch(() => false);

  if (!sourceExists) {
    throw new Error(`Le dossier source n'existe pas: ${sourceRoot}`);
  }

  const files = await collectTypeScriptFiles(sourceRoot);

  if (files.length === 0) {
    console.log(`Aucun fichier TypeScript trouve dans ${sourceRoot}`);
    return;
  }

  console.log(`Fichiers a convertir: ${files.length}`);

  let written = 0;

  for (const sourceFilePath of files) {
    const outputFilePath = resolveOutputPath(
      sourceFilePath,
      sourceRoot,
      outputRoot,
      options.inPlace,
    );

    const relativeIn = path.relative(cwd, sourceFilePath);
    const relativeOut = path.relative(cwd, outputFilePath);

    if (options.dryRun) {
      console.log(`[DRY RUN] ${relativeIn} -> ${relativeOut}`);
      continue;
    }

    const convertedCode = await convertSourceFile(sourceFilePath);

    await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
    await fs.writeFile(outputFilePath, convertedCode, "utf8");

    if (options.deleteSource && sourceFilePath !== outputFilePath) {
      await fs.unlink(sourceFilePath);
    }

    written += 1;
    console.log(`${relativeIn} -> ${relativeOut}`);
  }

  if (options.dryRun) {
    console.log("Aucune ecriture effectuee (dry-run).");
    return;
  }

  console.log(`Conversion terminee. Fichiers ecrits: ${written}`);
}

main().catch((error) => {
  console.error(`Erreur: ${error.message}`);
  process.exitCode = 1;
});
