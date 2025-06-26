<?php

namespace App\Http\Controllers\Panel;

use App\Http\Controllers\Controller;
use App\Http\Resources\Tenant\RoomTypeResource;
use App\Http\Resources\Tenant\RoomResource;
use App\Models\Tenant\RoomTypeModel;
use App\Models\Tenant\SettingModel;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Http\Requests\Panel\PanelRoomCreateRequest;
use App\Models\Tenant\RoomModel;
use App\Actions\Tenant\TenantFileAction;
use App\Models\Tenant\RoomGalleryModel;
use App\Models\Tenant\RoomComoditeModel;
use App\Models\Tenant\ComoditeModel;
use App\Http\Resources\Tenant\ComoditeResource;
use App\Models\Tenant\RoomPriceModel;

class PanelRoomsController extends Controller
{
    public function index()
    {
        $rooms = RoomModel::with([
            'type',
            'prices',
            'galleries',
            'comodites.comodite'
        ])->get();

        return Inertia::render('frontend-panel/pages/Rooms/PanelRoomIndex', [
            'rooms' => RoomResource::collection($rooms)->resolve(),
        ]);
    }


    public function create()
    {
        return Inertia::render('frontend-panel/pages/Rooms/PanelRoomCreate', [
            'roomTypes' => RoomTypeResource::collection(RoomTypeModel::with(['comodites.comodite', 'galleries'])->get())->resolve(),
            'comodites' => ComoditeResource::collection(ComoditeModel::all())->resolve(),
        ]);
    }

    public function store(PanelRoomCreateRequest $request)
    {
        $roomType = $request->room_type_id;

        // Create room type if not provided
        if (!$request->room_type_id) {
            // Get default language from settings
            $setting = SettingModel::first();
            $defaultLanguage = $setting->default_language;

            $roomType = RoomTypeModel::create([
                'name_pt' => $request->overview_name_pt,
                'name_en' => $request->overview_name_en,
                'name_es' => $request->overview_name_es,
                'name_fr' => $request->overview_name_fr,
                'description_pt' => $request->overview_description_pt,
                'description_en' => $request->overview_description_en,
                'description_es' => $request->overview_description_es,
                'description_fr' => $request->overview_description_fr,
                'slug_pt' => $request->overview_name_pt ? Str::slug($request->overview_name_pt) : '',
                'slug_en' => $request->overview_name_en ? Str::slug($request->overview_name_en) : '',
                'slug_es' => $request->overview_name_es ? Str::slug($request->overview_name_es) : '',
                'slug_fr' => $request->overview_name_fr ? Str::slug($request->overview_name_fr) : '',
            ]);
            $roomType = $roomType->id;
        }

        $room = RoomModel::create([
            'room_type_id' => $roomType,
            'max_adults' => $request->max_adults,
            'max_children' => $request->max_children,
            'max_infants' => $request->max_infants,
            'max_pets' => $request->max_pets,
        ]);


        // Handle gallery images (uploaded files)
        if ($request->gallery && is_array($request->gallery)) {
            $tenantId = $this->getTenantId();
            foreach ($request->gallery as $gallery) {
                $filePath = TenantFileAction::save($tenantId, $gallery, true, 'room/gallery');
                RoomGalleryModel::create([
                    'room_type_id' => $roomType,
                    'room_id' => $room->id,
                    'type' => $filePath->type,
                    'src' => $filePath->url,
                ]);
            }
        }

        // Handle imported gallery images (URLs)
        // When provice import gallery from type, just change in gallery, add room_id
        if ($request->room_type_id && $request->gallery_imported && is_array($request->gallery_imported)) {
            foreach ($request->gallery_imported as $importedSrc) {
                if (!$importedSrc) continue;
                RoomGalleryModel::where('room_type_id', $request->room_type_id)
                    ->where('src', $importedSrc)
                    ->update(['room_id' => $room->id]);
            }
        }

        // Handle prices (explicit fields for each currency)
        $currencies = ['usd', 'eur', 'aoa', 'brl'];
        foreach ($currencies as $currency) {
            $priceField = 'price_' . $currency;
            $ilustrativeField = $priceField . '_ilustrative';
            $statusField = $priceField . '_status';

            // Only create price record if status is true and price is not empty
            if ($request->$statusField && !empty($request->$priceField)) {
                $roomPrice = RoomPriceModel::create([
                    'room_type_id' => $roomType,
                    'room_id' => $room->id,
                    'currency_code' => $currency,
                    'price' => $request->$priceField,
                    'price_ilustrative' => $request->$ilustrativeField ?? null,
                    'status' => $request->$statusField,
                ]);
            }
        }

        // Handle comodites (update or create logic)
        if ($request->comodites && is_array($request->comodites)) {
            foreach ($request->comodites as $comoditeId) {
                if (!$comoditeId) continue;
                $updated = false;
                if ($request->room_type_id) {
                    $updated = RoomComoditeModel::where('room_type_id', $request->room_type_id)
                        ->where('comodite_id', $comoditeId)
                        ->update(['room_id' => $room->id]);
                }
                if (!$updated) {
                    RoomComoditeModel::create([
                        'room_id' => $room->id,
                        'comodite_id' => $comoditeId,
                    ]);
                }
            }
        }


        return redirect()->route('panel-room-index')->with('success', 'Room created successfully!');
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
