<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'phone_number',
        'address'
    ];
}
