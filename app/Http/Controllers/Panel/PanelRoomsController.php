<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PanelRoomsController extends Controller
{
    public function index()
    {
        return Inertia::render('frontend-panel/pages/Rooms/PanelRoomIndex');
    }

    public function create()
    {
        return Inertia::render('frontend-panel/pages/Rooms/PanelRoomCreate');
    }

    public function store(Request $request)
    {
        // TODO: Implement room creation logic
        return redirect()->route('panel-rooms');
    }

    public function show($roomIdHashed)
    {
        // TODO: Implement room show logic
        return Inertia::render('frontend-panel/pages/Rooms/PanelRoomShow');
    }

    public function edit($roomIdHashed)
    {
        // TODO: Implement room edit logic
        return Inertia::render('frontend-panel/pages/Rooms/PanelRoomEdit');
    }

    public function update(Request $request, $roomIdHashed)
    {
        // TODO: Implement room update logic
        return redirect()->route('panel-rooms');
    }

    public function destroy($roomIdHashed)
    {
        // TODO: Implement room deletion logic
        return redirect()->route('panel-rooms');
    }
}
