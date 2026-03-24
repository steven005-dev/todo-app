<?php

namespace Tests\Feature;

use App\Models\Tache;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class AfficherTachesTest extends TestCase
{
    use RefreshDatabase;

    public function test_afficher_taches_requires_authentication(): void
    {
        $response = $this->getJson('/api/taches');

        $response->assertStatus(401);
    }

    public function test_afficher_taches_returns_only_connected_user_tasks(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Tache::create([
            'intitule' => 'Tache user 1',
            'date' => '2026-03-24',
            'priorite' => 'moyenne',
            'statut' => 'en cours',
            'user_id' => $user->id,
        ]);

        Tache::create([
            'intitule' => 'Tache user 2',
            'date' => '2026-03-25',
            'priorite' => 'haute',
            'statut' => 'terminée',
            'user_id' => $otherUser->id,
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/taches');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'taches')
            ->assertJsonPath('taches.0.user_id', $user->id)
            ->assertJsonPath('taches.0.intitule', 'Tache user 1');
    }
}
