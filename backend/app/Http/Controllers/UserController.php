<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{
    //enregistrement d'un utilisateur
    public function register(Request $request)
    // Validation des données d'entrée
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:5',
        ]);
        

        // Création de l'utilisateur
        $user =User::create([
            'nom' => $validatedData['nom'],
            'prenom' => $validatedData['prenom'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']), // Le mot de passe sera automatiquement haché grâce au cast dans le modèle
        ]);

         $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 201);
        
    }

    public function login(Request $request)
{
    // Validation
    $credentials = $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

     if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

    // Connexion réussie avec le guard JWT
     $user = auth('api')->user();

        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
            ]
        ]);
}

    // LOGOUT
    public function logout()
    {
        JWTAuth::parseToken()->invalidate();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

     // USER connecté
    public function me()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            return response()->json([
                'user' => $user,
                'check' => auth('api')->check(),
                'token_present' => request()->bearerToken(),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Token invalide, expiré ou absent',
                'check' => auth('api')->check(),
                'token_present' => request()->bearerToken(),
            ], 401);
        }
    }
}
