<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\AuthRepositoryInterface;
use App\Interfaces\Services\AuthServiceInterface;
use Illuminate\Support\Facades\Cookie;
use Throwable;

class AuthService implements AuthServiceInterface
{
    protected $authRepository;

    public function __construct(AuthRepositoryInterface $authRepository)
    {
        $this->authRepository = $authRepository;
    }

    public function RegisterService($request)
    {
        try {
            $user = $this->authRepository->GetOne($request->username);
            if ($user) {
                return Helper::GetResponse(
                    400,
                    "A user data is registered!",
                    $user,
                );
            } else {
                $uuid = Helper::GenerateUuid();
                $hashedPassword = Helper::HashPassword($request->password);
                $data = [
                    "uuid" => $uuid,
                    "username" => $request->username,
                    "email" => $request->email,
                    "password" => $hashedPassword,
                    "role_id" => 2,
                    "is_active" => 1,
                    "created_at" => date("Y-m-d H:i:s"),
                    "created_by" => $uuid,
                    "created_by_username" => $request->username,
                ];
                $this->authRepository->Create($data);
                return Helper::GetResponse(
                    200,
                    "A new user is succesfully registered!",
                    $data,
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function LoginService($request)
    {
        try {
            $user = $this->authRepository->GetOne($request->username);
            if ($user) {
                $checkPassword = Helper::CheckPassword(
                    $request->password,
                    $user->password,
                );
                if ($checkPassword) {
                    $token = Helper::GenerateToken();
                    $data = [
                        "uuid" => $user->uuid,
                        "username" => $user->username,
                        "email" => $user->email,
                        "first_name" => $user->first_name,
                        "last_name" => $user->last_name,
                        "role_id" => $user->role_id,
                    ];
                    $sessions = [
                        "user_uuid" => $user->uuid,
                        "token" => $token,
                        "data" => json_encode($data),
                        "start_at" => date("Y-m-d H:i:s"),
                        "expired_at" => date(
                            "Y-m-d H:i:s",
                            strtotime("+1 day"),
                        ),
                        "created_at" => date("Y-m-d H:i:s"),
                        "created_by" => $user->uuid,
                        "created_by_username" => $user->username,
                    ];
                    $this->authRepository->CreateSession($sessions);
                    $cookie = Cookie::make(
                        "token",
                        $token,
                        60 * 24,
                        "/",
                        config("session.cookie-domain"),
                        config("session.cookie-secure"), // production: true kalau HTTPS
                        true, // HttpOnly
                        false,
                        "lax",
                    );
                    return Helper::GetResponse(
                        200,
                        "An user is succesfully login",
                        $sessions,
                    )->withCookie($cookie);
                } else {
                    return Helper::GetResponse(
                        400,
                        "A password did not match!",
                    );
                }
            } else {
                return Helper::GetResponse(400, "A user data is not found!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function LogoutService($request)
    {
        try {
            $token = $request->cookie("token");
            if ($token) {
                $this->authRepository->DeleteSession($token);
            }
            return Helper::GetResponse(
                200,
                "A user is succesfully logout!",
            )->cookie("token", "", -1);
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function AuthUserService($request)
    {
        $authUser = Helper::GetAuthUser($request);
        return Helper::GetResponse(200, "Authenticated user", $authUser);
    }
}
