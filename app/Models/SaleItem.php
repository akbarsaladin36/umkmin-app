<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'quantity',
        'price'
    ];
}
