<?php

namespace App\Http\Controllers;

use Auth;
use App\User;
use App\Events\ChatEvent;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function chat()
    {
        return view('chat');
    }

    public function send(Request $request)
    {
        $message = $request->input('message');
        $this->saveToSession($request);
        $user = User::find(Auth::id());
        event(new ChatEvent($message , $user));
        return $request->all();
    }

    //save messages to session
    public function saveToSession(Request $request)
    {
        $arr = [
            'chat' => $request->input('chat') , 
            'message' => $request->input('message') , 
            'colors' => $request->input('colors') ,
            'users' => $request->input('users') , 
            'time' => $request->input('time')
        ];
        return session()->put('chat' , $arr);
    }

    public function getOldMessage()
    {
    	return session('chat');
    }

    public function destroySession()
    {
        session()->forget('chat');
        return response()->json(['success' => 'current here']);
    }
    // public function send()
    // {
    //     $message = 'hello there good friends';
    //     $user = User::find(Auth::id());
    //     event(new ChatEvent($message , $user));
    //     // return response()->json(['status' => 'success']);
    // }
}
