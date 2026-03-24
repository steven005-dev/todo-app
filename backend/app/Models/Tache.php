<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tache extends Model
{
    protected $table = 'taches';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'intitule',
        'user_id',
        'date',
        'priorite',
        'statut',
    ];
    
    protected $casts = [
    'date' => 'datetime',
];
 protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
}
