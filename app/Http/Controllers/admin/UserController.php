<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    //
    public function index()
    {
        $users = User::select('id', 'fullname', 'email', 'role', 'isDeleted')->get();
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function softDelete($id)
    {
        $user = User::findOrFail($id);
        $user->update(['isDeleted' => true]);
        return redirect()->back();
    }
}
