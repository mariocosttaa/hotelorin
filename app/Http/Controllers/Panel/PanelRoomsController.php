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
use App\Http\Requests\Panel\PanelRoomUpdateRequest;
use App\Models\Tenant\RoomModel;
use App\Actions\Tenant\TenantFileAction;
use App\Models\Tenant\RoomGalleryModel;
use App\Models\Tenant\RoomComoditeModel;
use App\Models\Tenant\ComoditeModel;
use App\Http\Resources\Tenant\ComoditeResource;
use App\Models\Tenant\RoomPriceModel;
use App\Actions\General\EasyHashAction;
use Illuminate\Support\Facades\Log;

class PanelRoomsController extends Controller
{
    public function index()
    {
        $rooms = RoomModel::with([
            'roomType',
            'prices.currency',
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
            'roomTypes' => RoomTypeResource::collection(RoomTypeModel::with(['comodites.comodite', 'galleries', 'prices.currency'])->get())->resolve(),
            'comodites' => ComoditeResource::collection(ComoditeModel::all())->resolve(),
        ]);
    }

    public function store(PanelRoomCreateRequest $request)
    {
        $roomType = $request->room_type_id;

        // Create room type if not provided
        if (!$request->room_type_id) {
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
            'number' => $request->number,
            'max_adults' => $request->max_adults,
            'max_children' => $request->max_children,
            'max_infants' => $request->max_infants,
            'max_pets' => $request->max_pets,
            // Save room-specific names and descriptions if provided
            'overview_name_pt' => $request->overview_name_pt,
            'overview_name_en' => $request->overview_name_en,
            'overview_name_es' => $request->overview_name_es,
            'overview_name_fr' => $request->overview_name_fr,
            'overview_description_pt' => $request->overview_description_pt,
            'overview_description_en' => $request->overview_description_en,
            'overview_description_es' => $request->overview_description_es,
            'overview_description_fr' => $request->overview_description_fr,
        ]);

        // Handle uploaded gallery files (room-specific)
        if ($request->gallery && count($request->gallery) > 0) {
            $tenantId = $this->getTenantId();
            foreach ($request->gallery as $gallery) {
                $filePath = TenantFileAction::save($tenantId, $gallery, true, 'room/gallery');
                RoomGalleryModel::create([
                    'room_id' => $room->id,
                    'use_type_gallery_in_room' => false, // Room-specific
                    'type' => $filePath->type,
                    'src' => $filePath->url,
                ]);
            }
        }

        // Handle imported gallery images from room type
        if ($request->gallery_imported && is_array($request->gallery_imported)) {
            foreach ($request->gallery_imported as $importedSrc) {
                if (!$importedSrc) continue;

                // Find the gallery from room type and create a copy for the room
                $typeGallery = RoomGalleryModel::where('room_type_id', $roomType)
                    ->where('src', $importedSrc)
                    ->where('use_type_gallery_in_room', true)
                    ->first();

                if ($typeGallery) {
                    // Don't create a copy - just mark the room to inherit from room type
                    // The inheritance will be handled by the getFullGallery() method
                    Log::info('Room will inherit gallery from room type', [
                        'room_id' => $room->id,
                        'room_type_id' => $roomType,
                        'gallery_src' => $importedSrc
                    ]);
                }
            }
        }

        // Handle prices (room-specific)
        $currencies = ['usd', 'eur', 'aoa', 'brl'];
        foreach ($currencies as $currency) {
            $priceField = 'price_' . $currency;
            $ilustrativeField = $priceField . '_ilustrative';
            $statusField = $priceField . '_status';

            if (!empty($request->$priceField)) {
                RoomPriceModel::create([
                    'room_id' => $room->id,
                    'use_type_price_in_room' => false, // Room-specific
                    'currency_code' => $currency,
                    'price' => $request->$priceField,
                    'price_ilustrative' => $request->$ilustrativeField ?? null,
                    'status' => $request->$statusField,
                ]);
            }
        }

        // Handle comodites (garante que só existam os enviados, sem duplicatas)
        // Remove todos os comodites do room que não estão na lista enviada
        $comoditesIds = $request->comodites && is_array($request->comodites) ? $request->comodites : [];
        RoomComoditeModel::where('room_id', $room->id)
            ->whereNotIn('comodite_id', $comoditesIds)
            ->delete();

        // Se não enviou nenhum, já removeu todos acima
        if (empty($comoditesIds)) {
            // Remove também qualquer relação herdada
            RoomComoditeModel::where('room_id', $room->id)->delete();
        } else {
            foreach ($comoditesIds as $comoditeId) {
                if (!$comoditeId) continue;
                // Busca qualquer comodite já associada ao quarto
                $existingComodite = RoomComoditeModel::where('room_id', $room->id)
                    ->where('comodite_id', $comoditeId)
                    ->first();

                // Verifica se deve ser herdado ou específico
                $inheritedComodite = RoomComoditeModel::where('room_type_id', $roomType)
                    ->where('comodite_id', $comoditeId)
                    ->where('use_type_comodites_in_room', true)
                    ->first();

                $shouldBeInherited = (bool) $inheritedComodite;

                if ($existingComodite) {
                    // Atualiza o tipo de relação se necessário
                    if ($existingComodite->use_type_comodites_in_room != $shouldBeInherited) {
                        $existingComodite->update([
                            'use_type_comodites_in_room' => $shouldBeInherited,
                        ]);
                    }
                } else {
                    // Cria a relação correta
                    RoomComoditeModel::create([
                        'room_id' => $room->id,
                        'use_type_comodites_in_room' => $shouldBeInherited,
                        'comodite_id' => $comoditeId,
                    ]);
                }
            }
        }

        return redirect()->route('panel-room-index', ['tenantId' => $this->getTenantIdHashed()])->with('success', 'Room created successfully!');
    }

    public function edit(string $tenantIdHashed, string $roomIdHashed)
    {

        $roomId = EasyHashAction::decode($roomIdHashed, 'room-id');

        if (!$roomId) {
            Log::error('Room ID decode failed for: ' . $roomIdHashed);
            return redirect()->route('panel-room-index', ['tenantId' => $this->getTenantIdHashed()])->with('error', 'Room not found');
        }

        $room = RoomModel::with([
            'roomType',
            'prices.currency',
            'galleries',
            'comodites.comodite'
        ])->find($roomId);

        if (!$room) {
            Log::error('Room not found in database for ID: ' . $roomId);
            return redirect()->route('panel-room-index', ['tenantId' => $this->getTenantIdHashed()])->with('error', 'Room not found');
        }

        return Inertia::render('frontend-panel/pages/Rooms/PanelRoomEdit', [
            'room' => (new RoomResource($room))->resolve(),
            'comodites' => ComoditeResource::collection(ComoditeModel::all())->resolve(),
        ]);
    }

    public function update(PanelRoomUpdateRequest $request, string $tenantIdHashed, string $roomIdHashed)
    {

        $roomId = EasyHashAction::decode($roomIdHashed, 'room-id');
        if (!$roomId) {
            return redirect()->route('panel-room-index', ['tenantId' => $this->getTenantIdHashed()])->with('error', 'Room not found');
        }

        $room = RoomModel::where('id', $roomId)->with(['roomType', 'prices.currency', 'galleries', 'comodites'])->first();
        if (!$room) {
            return redirect()->route('panel-room-index', ['tenantId' => $this->getTenantIdHashed()])->with('error', 'Room not found');
        }

        // Decode room_type_id if provided
        $roomType = $request->room_type_id;

        // Use existing room type if provided, otherwise create new one
        if (!$roomType) {
            // Create new room type only if no room type is provided
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

        // Update room basic info
        $room->update([
            'room_type_id' => $roomType,
            'number' => $request->number,
            'max_adults' => $request->max_adults,
            'max_children' => $request->max_children,
            'max_infants' => $request->max_infants,
            'max_pets' => $request->max_pets,
            // Save room-specific names and descriptions if provided
            'overview_name_pt' => $request->overview_name_pt,
            'overview_name_en' => $request->overview_name_en,
            'overview_name_es' => $request->overview_name_es,
            'overview_name_fr' => $request->overview_name_fr,
            'overview_description_pt' => $request->overview_description_pt,
            'overview_description_en' => $request->overview_description_en,
            'overview_description_es' => $request->overview_description_es,
            'overview_description_fr' => $request->overview_description_fr,
        ]);

        // Handle gallery deletions (only room-specific galleries)
        if ($request->gallery_to_delete && is_array($request->gallery_to_delete)) {
            foreach ($request->gallery_to_delete as $galleryId) {
                $gallery = RoomGalleryModel::where('id', $galleryId)
                    ->where('room_id', $room->id)
                    ->where('use_type_gallery_in_room', false) // Only delete room-specific
                    ->first();

                if ($gallery) {
                    // Delete the file from storage
                    $deleted = TenantFileAction::delete($this->getTenantId(), fileUrl: $gallery->src, isPublic: true);
                    if (!$deleted) {
                        Log::warning('Failed to delete gallery file during update', [
                            'tenant_id' => $this->getTenantId(),
                            'gallery_id' => $gallery->id,
                            'file_url' => $gallery->src
                        ]);
                    }
                    // Delete the gallery record
                    $gallery->delete();
                }
            }
        }

        // Handle new uploaded gallery files (room-specific)
        if ($request->gallery && count($request->gallery) > 0) {
            $tenantId = $this->getTenantId();
            foreach ($request->gallery as $gallery) {
                $filePath = TenantFileAction::save($tenantId, $gallery, true, 'room/gallery');
                RoomGalleryModel::create([
                    'room_id' => $room->id,
                    'use_type_gallery_in_room' => false, // Room-specific
                    'type' => $filePath->type,
                    'src' => $filePath->url,
                ]);
            }
        }

        // Handle imported gallery images from room type
        if ($request->gallery_imported && is_array($request->gallery_imported)) {
            foreach ($request->gallery_imported as $importedSrc) {
                if (!$importedSrc) continue;

                // Find the gallery from room type and create a copy for the room
                RoomGalleryModel::where('room_type_id', $roomType)
                    ->where('src', $importedSrc)
                    ->where('use_type_gallery_in_room', true)
                    ->first();
            }
        }

        // Handle prices (update or create room-specific)
        $currencies = ['usd', 'eur', 'aoa', 'brl'];
        foreach ($currencies as $currency) {
            $priceField = 'price_' . $currency;
            $ilustrativeField = $priceField . '_ilustrative';
            $statusField = $priceField . '_status';

            //verify if price exists
            $existingPrice = RoomPriceModel::where('room_id', $room->id)
                ->where('currency_code', $currency)
                ->first();

            //if price exists, update it
            if ($existingPrice) {

                $existingPrice->update([
                    'price' => $request->$priceField,
                    'price_ilustrative' => $request->$ilustrativeField ?? null,
                    'use_type_price_in_room' => false, // Room-specific
                    'status' => $request->$statusField,
                ]);


            //if price is null, delete it
            } else if ($request->$priceField == null) {
                //if price is null, AND price exists, delete it
                if ($existingPrice) {
                    $existingPrice->delete();
                }
            } else {

                //if price does not exist, create it
                RoomPriceModel::create([
                    'room_id' => $room->id,
                    'use_type_price_in_room' => false, // Room-specific
                    'currency_code' => $currency,
                    'price' => $request->$priceField,
                    'price_ilustrative' => $request->$ilustrativeField ?? null,
                    'status' => $request->$statusField,
                ]);
            }

        }

        // Handle comodites (garante que só existam os enviados, sem duplicatas)
        // Remove todos os comodites do room que não estão na lista enviada
        $comoditesIds = $request->comodites && is_array($request->comodites) ? $request->comodites : [];
        RoomComoditeModel::where('room_id', $room->id)
            ->whereNotIn('comodite_id', $comoditesIds)
            ->delete();

        // Se não enviou nenhum, já removeu todos acima
        if (empty($comoditesIds)) {
            // Remove também qualquer relação herdada
            RoomComoditeModel::where('room_id', $room->id)->delete();
        } else {
            foreach ($comoditesIds as $comoditeId) {
                if (!$comoditeId) continue;
                // Busca qualquer comodite já associada ao quarto
                $existingComodite = RoomComoditeModel::where('room_id', $room->id)
                    ->where('comodite_id', $comoditeId)
                    ->first();

                // Verifica se deve ser herdado ou específico
                $inheritedComodite = RoomComoditeModel::where('room_type_id', $roomType)
                    ->where('comodite_id', $comoditeId)
                    ->where('use_type_comodites_in_room', true)
                    ->first();

                $shouldBeInherited = (bool) $inheritedComodite;

                if ($existingComodite) {
                    // Atualiza o tipo de relação se necessário
                    if ($existingComodite->use_type_comodites_in_room != $shouldBeInherited) {
                        $existingComodite->update([
                            'use_type_comodites_in_room' => $shouldBeInherited,
                        ]);
                    }
                } else {
                    // Cria a relação correta
                    RoomComoditeModel::create([
                        'room_id' => $room->id,
                        'use_type_comodites_in_room' => $shouldBeInherited,
                        'comodite_id' => $comoditeId,
                    ]);
                }
            }
        }



        return redirect()->route('panel-room-index', ['tenantId' => $this->getTenantIdHashed()])->with('success', 'Room updated successfully!');
    }

    public function destroy(string $tenantIdHashed, string $roomIdHashed)
    {
        $roomId = EasyHashAction::decode($roomIdHashed, 'room-id');
        if (!$roomId) {
            if (request()->expectsJson()) {
                return response()->json(['error' => 'Room not found'], 404);
            }
            return redirect()->route('panel-room-index', ['tenantId' => $this->getTenantIdHashed()])->with('error', 'Room not found');
        }

        $room = RoomModel::with('galleries')->find($roomId);
        if (!$room) {
            if (request()->expectsJson()) {
                return response()->json(['error' => 'Room not found'], 404);
            }
            return redirect()->route('panel-room-index', ['tenantId' => $this->getTenantIdHashed()])->with('error', 'Room not found');
        }

        // Delete room-specific gallery files from storage first
        if ($room->galleries) {
            foreach ($room->galleries as $gallery) {
                if (!$gallery->use_type_gallery_in_room) { // Only delete room-specific files
                    $deleted = TenantFileAction::delete($this->getTenantId(), fileUrl: $gallery->src, isPublic: true);
                    if (!$deleted) {
                        Log::warning('Failed to delete gallery file during room deletion', [
                            'tenant_id' => $this->getTenantId(),
                            'gallery_id' => $gallery->id,
                            'file_url' => $gallery->src
                        ]);
                    }
                }
            }
        }

        // Delete ALL related data for this room (both specific and inherited)
        RoomComoditeModel::where('room_id', $room->id)->delete();
        RoomGalleryModel::where('room_id', $room->id)->delete();
        RoomPriceModel::where('room_id', $room->id)->delete();

        // Delete the room
        $room->delete();

        if (request()->expectsJson()) {
            return response()->json(['success' => 'Room deleted successfully']);
        }

        return redirect()->route('panel-room-index', ['tenantId' => $this->getTenantIdHashed()])->with('success', 'Room deleted successfully');
    }

    public function destroyGallery(string $tenantIdHashed, string $roomIdHashed, string $galleryIdHashed)
    {
        $roomId = EasyHashAction::decode($roomIdHashed, 'room-id');
        $galleryId = EasyHashAction::decode($galleryIdHashed, 'room-gallery-id');

        if (!$roomId || !$galleryId) {
            if (request()->expectsJson()) {
                return response()->json(['error' => 'Invalid parameters'], 400);
            }
            return back()->with('error', 'Invalid parameters');
        }

        // First check if the gallery exists and belongs to this room
        $gallery = RoomGalleryModel::where('id', $galleryId)
            ->where('room_id', $roomId)
            ->first();

        if (!$gallery) {
            if (request()->expectsJson()) {
                return response()->json(['error' => 'Gallery not found'], 404);
            }
            return back()->with('error', 'Gallery not found');
        }

        if($gallery->use_type_gallery_in_room == true){
            $gallery->update([
                'use_type_gallery_in_room' => false,
                'room_id' => null,
            ]);
        } else {
            TenantFileAction::delete($this->getTenantId(), fileUrl: $gallery->src, isPublic: true);
            $gallery->delete();
        }

        if (request()->expectsJson()) {
            return response()->json(['success' => 'Image deleted successfully']);
        }

        return back()->with('success', 'Image deleted successfully');
    }
}
