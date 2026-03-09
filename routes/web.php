<?php

use Illuminate\Support\Facades\Route;

// Route::get('/{any}', function () {
//     return view('app');
// })->where('any', '.*');

Route::view("/{path?}", "app")->where("path", ".*");
