<?php

namespace Tests\Feature;

use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_todos(): void
    {
        Todo::factory()->count(3)->create();

        $response = $this->getJson('/api/todos');

        $response->assertOk()->assertJsonCount(3);
    }

    public function test_can_create_todo(): void
    {
        $response = $this->postJson('/api/todos', ['title' => 'Acheter du lait']);

        $response->assertCreated()
            ->assertJsonFragment(['title' => 'Acheter du lait', 'completed' => false]);

        $this->assertDatabaseHas('todos', ['title' => 'Acheter du lait']);
    }

    public function test_create_todo_requires_title(): void
    {
        $response = $this->postJson('/api/todos', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    }

    public function test_can_toggle_todo_completed(): void
    {
        $todo = Todo::factory()->create(['completed' => false]);

        $response = $this->putJson("/api/todos/{$todo->id}", ['completed' => true]);

        $response->assertOk()->assertJsonFragment(['completed' => true]);
        $this->assertDatabaseHas('todos', ['id' => $todo->id, 'completed' => true]);
    }

    public function test_can_update_todo_title(): void
    {
        $todo = Todo::factory()->create(['title' => 'Old title']);

        $response = $this->putJson("/api/todos/{$todo->id}", ['title' => 'New title']);

        $response->assertOk()->assertJsonFragment(['title' => 'New title']);
        $this->assertDatabaseHas('todos', ['id' => $todo->id, 'title' => 'New title']);
    }

    public function test_can_delete_todo(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->deleteJson("/api/todos/{$todo->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('todos', ['id' => $todo->id]);
    }

    public function test_delete_nonexistent_todo_returns_404(): void
    {
        $response = $this->deleteJson('/api/todos/99999');

        $response->assertNotFound();
    }
}
