<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class MeRouteAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_me_route_returns_unauthorized_without_token(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }

    public function test_me_route_returns_authenticated_user_with_valid_jwt_token(): void
    {
        $user = User::factory()->create();
        $token = JWTAuth::fromUser($user);

        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/me');

        $response
            ->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('user.email', $user->email);
    }
}
