<?php

namespace App\Helper;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class Helper 
{
    public static function GetResponse($status = 200, $message = '', $data = [])
    {
        return response()->json(['status' => $status, 'message' => $message, 'data' => $data], $status);
    }

    public static function HashPassword($password = '')
    {
        return Hash::make($password);
    }

    public static function CheckPassword($inputPassword, $userPassword)
    {
        return Hash::check($inputPassword, $userPassword);
    }

    public static function GenerateUuid()
    {
        return str_replace('-', '', Str::uuid());
    }

    public static function GenerateSlug($words)
    {
        return Str::slug($words);
    }

    public static function GenerateToken()
    {
        $randomString = Str::random(300);
        $plainToken = hash('sha256', $randomString);
        return $plainToken;
    }

    public static function GetAuthUser($request)
    {
        return (object) $request->attributes->get('auth');
    }

    public static function GenerateCode($codeType = '') {
        switch ($codeType) {
            case 'products':
                $code = 'PU'.'-'.date('Ymd').'-'.rand(1000, 999999);
                break;
            case 'sales':
                $code = 'SU'.'-'.date('Ymd').'-'.rand(1000, 999999);
                break;
            case 'sale-items':
                $code = 'SIU'.'-'.date('Ymd').'-'.rand(1000, 999999);
                break;
            case 'products-barcode':
                $code = 'PRB'.date('Ymd').rand(100000, 999999999);
                break;
            case 'invoice-sales':
                $code = 'INV'.'-'.'SLS'.date('Ymd').'-'.rand(1000, 999999);
                break;
            case 'suppliers':
                $code = 'SUP'.'-'.date('Ymd').'-'.rand(1000, 999999);
                break;
            case 'purchases':
                $code = 'PSU'.'-'.date('Ymd').'-'.rand(1000, 999999);
                break;
            case 'invoice-purchases':
                $code = 'INV'.'-'.'PSU'.date('Ymd').'-'.rand(1000, 999999);
                break;
            case 'purchase-items':
                $code = 'PSIU'.'-'.date('Ymd').'-'.rand(1000, 999999);
                break;
            case 'cash-transactions':
                $code = 'CT'.'-'.date('Ymd').'-'.rand(1000, 999999);
                break;
            default:
                $code = 'invalid-code';
                break;
        }
        return $code;
    }

    public static function CheckSession($token)
    {
        return DB::table('sessions')->where('token', $token)->where('expired_at', '>', Carbon::now())->first();
    }
}