<?php

namespace App\Services;

use App\Helper\Helper;
use App\Interfaces\Repositories\UserRepositoryInterface;
use App\Interfaces\Services\UserServiceInterface;
use Throwable;

class UserService implements UserServiceInterface
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function GetUsersService()
    {
        try {
            $users = $this->userRepository->GetAll();
            if (count($users) > 0) {
                return Helper::GetResponse(
                    200,
                    "All users are succesfully appeared!",
                    $users,
                );
            } else {
                return Helper::GetResponse(400, "All users are empty!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetUsersPaginateService($request)
    {
        try {
            $search = $request->search ? $request->search : null;
            $page = $request->page ? $request->page : 1;
            $limit = $request->limit ? $request->limit : 5;
            $page = max((int) $page, 1);
            $limit = max((int) $limit, 1);
            $users = $this->userRepository->GetPaginate($search, $page, $limit);
            if ($users["total"] > 0) {
                return Helper::GetResponse(
                    200,
                    "All users are succesfully appeared!",
                    $users,
                );
            } else {
                return Helper::GetResponse(400, "All users are empty!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetUsersByKasirService()
    {
        try {
            $users = $this->userRepository->GetAllByKasir();
            if (count($users) > 0) {
                return Helper::GetResponse(
                    200,
                    "All users by role kasir are succesfully appeared!",
                    $users,
                );
            } else {
                return Helper::GetResponse(
                    400,
                    "All users by role kasir are empty!",
                );
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function GetUserService($username)
    {
        try {
            $user = $this->userRepository->GetOne($username);
            if ($user) {
                return Helper::GetResponse(
                    200,
                    "A user data is succesfully appeared!",
                    $user,
                );
            } else {
                return Helper::GetResponse(400, "A user data is empty!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function CreateUserService($request)
    {
        try {
            $user = $this->userRepository->GetOne($request->username);
            if ($user) {
                return Helper::GetResponse(400, "A user data is registered!");
            } else {
                if ($request->password != $request->confirm_password) {
                    return Helper::GetResponse(
                        400,
                        "A password must be same like confirm password!",
                    );
                } else {
                    $uuid = Helper::GenerateUuid();
                    $hashedPassword = Helper::HashPassword($request->password);
                    $authUser = Helper::GetAuthUser($request);
                    $data = [
                        "uuid" => $uuid,
                        "username" => $request->username,
                        "email" => $request->email,
                        "password" => $hashedPassword,
                        "first_name" => $request->first_name,
                        "last_name" => $request->last_name,
                        "address" => $request->address,
                        "phone_number" => $request->phone_number,
                        "role_id" => $request->role_id,
                        "is_active" => 1,
                        "created_at" => date("Y-m-d H:i:s"),
                        "created_by" => $authUser->uuid,
                        "created_by_username" => $authUser->username,
                    ];
                    $this->userRepository->Create($data);
                    return Helper::GetResponse(
                        200,
                        "A new user is succesfully registered!",
                        $data,
                    );
                }
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function UpdateUserService($username, $request)
    {
        try {
            $user = $this->userRepository->GetOne($request->username);
            if ($user) {
                $authUser = Helper::GetAuthUser($request);
                $data = [
                    "first_name" => $request->first_name
                        ? $request->first_name
                        : $user->first_name,
                    "last_name" => $request->last_name
                        ? $request->last_name
                        : $user->last_name,
                    "address" => $request->address
                        ? $request->address
                        : $user->address,
                    "phone_number" => $request->phone_number
                        ? $request->phone_number
                        : $user->phone_number,
                    "role_id" => $request->role_id
                        ? $request->role_id
                        : $user->role_id,
                    "is_active" => $request->is_active
                        ? $request->is_active
                        : $user->is_active,
                    "updated_at" => date("Y-m-d H:i:s"),
                    "updated_by" => $authUser->uuid,
                    "updated_by_username" => $authUser->username,
                ];
                $this->userRepository->Update($username, $data);
                return Helper::GetResponse(
                    200,
                    "An existing user is succesfully updated!",
                    $data,
                );
            } else {
                return Helper::GetResponse(400, "A user data is not found!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }

    public function DeleteUserService($username)
    {
        try {
            $user = $this->userRepository->GetOne($username);
            if ($user) {
                $this->userRepository->Delete($username);
                return Helper::GetResponse(
                    200,
                    "A user data is succesfully deleted!",
                );
            } else {
                return Helper::GetResponse(400, "A user data is empty!");
            }
        } catch (Throwable $e) {
            return Helper::GetResponse(500, $e->getMessage());
        }
    }
}
