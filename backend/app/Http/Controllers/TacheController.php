<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tache;
use Illuminate\Support\Facades\Auth;
//creer une tâche
class TacheController extends Controller
{
    public function AjouterTache(Request $request){
        // Validation des données d'entrée
        $validatedata = $request->validate([
            'intitule' => 'required|string|max:255',
            'date' => 'required|date',
            'priorite' => 'nullable|in:faible,moyenne,haute',
            'statut' => 'nullable|in:en cours,terminée',
            

        ]);

        $user = Auth::user();
        // Création de la tâche
        $Tache = Tache::create([
            'intitule' => $validatedata['intitule'],
            'date' => $validatedata['date'],
            'priorite' => $validatedata['priorite'],
            'statut' => $validatedata['statut'] ?? 'en cours',
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Tâche ajoutée avec succès', 'tache' => $Tache], 201);


    }

    //modifier une tâche
    public function ModifierTache(Request $request, $id){
        $tache = Tache::find($id);
        if (!$tache) {
            return response()->json(['message' => 'Tâche non trouvée'], 404);
        }
        
        //validation des données d'entrée
        $validationData = $request->validate([
            'intitule' => 'sometimes|string|max:255',
        'date' => 'sometimes|date',
        'priorite' => 'sometimes|in:faible,moyenne,haute',
        'statut' => 'sometimes|in:en cours,terminée',
        ]);

        // Mise à jour de la tâche
        $tache->update($validationData);
        return response()->json(['message' => 'Tâche modifiée avec succès', 'tache' => $tache], 200);
    }

    //supprimer une tâche
    public function SupprimerTache($id){
        $tache = Tache::find($id);
        if (!$tache) {
            return response()->json(['message' => 'Tâche non trouvée'], 404);
        }
        $tache->delete();
        return response()->json(['message' => 'Tâche supprimée avec succès'], 200);
    }

    //afficher les tâches d'un utilisateur
    public function AfficherTaches(){
        $user = Auth::user();
        $taches = Tache::where('user_id', $user->id)->get();
        return response()->json(['taches' => $taches], 200);}

    public function NombreTaches(){
        $user = Auth::user();
        $nombreTaches = Tache::where('user_id', $user->id)->count();
        return response()->json(['nombre_taches' => $nombreTaches], 200);
    }

    public function NombreTachesEnCours(){
        $user = Auth::user();
        $nombreTachesEnCours = Tache::where('user_id', $user->id)->where('statut', 'en cours')->count();
        return response()->json(['nombre_taches_en_cours' => $nombreTachesEnCours], 200);
    }

    public function NombreTachesTerminees(){
        $user = Auth::user();
        $nombreTachesTerminees = Tache::where('user_id', $user->id)->where('statut', 'terminée')->count();
        return response()->json(['nombre_taches_terminees' => $nombreTachesTerminees], 200);
    }



}




