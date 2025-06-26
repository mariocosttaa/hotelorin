<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PanelProfileController extends Controller
{
    /**
     * Update the authenticated user's profile details (language, etc).
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            // For Inertia, redirect back with error
            if ($request->hasHeader('X-Inertia')) {
                return redirect()->back()->with('error', 'Unauthorized');
            }
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $data = $request->only(['language']);
        $validator = Validator::make($data, [
            'language' => 'required|string|in:en,pt,es,fr',
        ]);

        if ($validator->fails()) {
            // For Inertia, redirect back with errors
            if ($request->hasHeader('X-Inertia')) {
                return redirect()->back()->withErrors($validator);
            }
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->language = $data['language'];
        $user->save();

        // Optionally, set a cookie for fallback
        cookie()->queue(cookie('locale', $data['language'], 60 * 24 * 30)); // 30 days

        Log::info('User language updated', ['user_id' => $user->id, 'language' => $data['language']]);

        // If it's an Inertia request, redirect back with success message
        if ($request->hasHeader('X-Inertia')) {
            return redirect()->back()->with('success', 'Language updated successfully');
        }

        // Fallback for non-Inertia requests
        return response()->json(['message' => 'Language updated successfully', 'language' => $user->language]);
    }
}
