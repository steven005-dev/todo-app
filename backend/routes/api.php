<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TacheController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Ici tu définis toutes les routes de ton API.
| Ces routes sont automatiquement préfixées par /api
|
*/
// Routes pour les utilisateurs
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::middleware('auth:api')->get('/me', [UserController::class, 'me']);
// Routes pour les tâches
Route::middleware('auth:api')->post('/taches/add', [TacheController::class, 'AjouterTache']);
Route::put('/taches/update/{id}', [TacheController::class, 'ModifierTache']);
Route::delete('/taches/delete/{id}', [TacheController::class, 'SupprimerTache']);
Route::middleware('auth:api')->get('/taches', [TacheController::class, 'AfficherTaches']);
Route::middleware('auth:api')->get('/taches/nombre', [TacheController::class, 'NombreTaches']);
Route::middleware('auth:api')->get('/taches/en-cours', [TacheController::class, 'NombreTachesEnCours']);
Route::middleware('auth:api')->get('/taches/terminees', [TacheController::class, 'NombreTachesTerminees']);