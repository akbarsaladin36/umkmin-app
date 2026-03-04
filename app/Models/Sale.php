<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'total_amount',
        'discount',
        'final_amount',
        'payment_method',
        'paid_amount',
        'change_amount',
        'status'
    ];
}
