<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'cost_price',
        'selling_price',
        'stock',
        'min_stock'
    ];
}
