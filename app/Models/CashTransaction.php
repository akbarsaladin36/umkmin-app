<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashTransaction extends Model
{
    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'category',
        'amount',
        'description',
    ];
}
