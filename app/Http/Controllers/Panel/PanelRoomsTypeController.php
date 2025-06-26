<?php

namespace App\Http\Controllers\Panel;

use App\Actions\General\EasyHashAction;
use App\Actions\Tenant\TenantFileAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Panel\PanelRoomTypeCreateRequest;
use App\Http\Requests\Panel\PanelRoomTypeUpdateRequest;
use App\Http\Resources\Tenant\ComoditeResource;
use App\Http\Resources\Tenant\RoomTypeResource;
use App\Models\Tenant\ComoditeModel;
use App\Models\Tenant\RoomComoditeModel;
use App\Models\Tenant\RoomGalleryModel;
use App\Models\Tenant\RoomTypeModel;
use App\Models\Tenant\SettingModel;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PanelRoomsTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('frontend-panel/pages/RoomType/PanelRoomTypeIndex', [
            'roomTypes' => RoomTypeResource::collection(RoomTypeModel::with(['comodites.comodite', 'galleries'])->get())->resolve()
        ]);
    }

    public function create()
    {
        return Inertia::render('frontend-panel/pages/RoomType/PanelRoomTypeCreate', [
            'comodites' => ComoditeResource::collection(ComoditeModel::all())->resolve()
        ]);
    }

    public function store(PanelRoomTypeCreateRequest $request)
    {

        $roomType = RoomTypeModel::create([
            'name_pt' => $request->name_pt,
            'name_en' => $request->name_en,
            'name_es' => $request->name_es,
            'name_fr' => $request->name_fr,
            'description_pt' => $request->description_pt,
            'description_en' => $request->description_en,
            'description_es' => $request->description_es,
            'description_fr' => $request->description_fr,
            'slug_pt' => Str::slug($request->name_pt),
            'slug_en' => Str::slug($request->name_en),
            'slug_es' => Str::slug($request->name_es),
            'slug_fr' => Str::slug($request->name_fr),
        ]);

        //insert the comodites
        if ($request->comodites && is_array($request->comodites)) {
            foreach ($request->comodites as $comoditeId) {
                RoomComoditeModel::create([
                    'room_type_id' => $roomType->id,
                    'comodite_id' => $comoditeId,
                ]);
            }
        }

        //insert the gallery
        if ($request->gallery && is_array($request->gallery)) {
            $tenantId = $this->getTenantId();
            foreach ($request->gallery as $gallery) {
                $filePath = TenantFileAction::save($tenantId, $gallery, true, 'room/gallery');
                RoomGalleryModel::create([
                    'room_type_id' => $roomType->id,
                    'type' => $filePath->type,
                    'src' => $filePath->url,
                ]);
            }
        }


        return redirect()->route('panel-room-type-index', parent::localeAndTenantArray())->with('success', 'Room type Created Successfully');

    }


    public function edit(string $tenantId, string $roomTypeIdHashed)
    {

        $roomTypeId = EasyHashAction::decode($roomTypeIdHashed, 'room-type-id');
        if(!$roomTypeId){
            return redirect()->route('panel-room-type-index', parent::localeAndTenantArray())->with('error', 'Room type not found');
        }

        $roomType = RoomTypeModel::with(['comodites.comodite', 'galleries'])->where('id', $roomTypeId)->first();
        if(!$roomType){
            return redirect()->route('panel-room-type-index', parent::localeAndTenantArray())->with('error', 'Room type not found');
        }

        return Inertia::render('frontend-panel/pages/RoomType/PanelRoomTypeEdit', [
            'roomType' => RoomTypeResource::make($roomType)->resolve(),
            'comodites' => ComoditeResource::collection(ComoditeModel::all())->resolve(),
            'defaultLanguage' => SettingModel::first()->default_language
        ]);
    }


    public function update(PanelRoomTypeUpdateRequest $request, string $tenantId, string $roomTypeIdHashed)
    {
        $roomTypeId = EasyHashAction::decode($roomTypeIdHashed, 'room-type-id');
        if(!$roomTypeId){
            return redirect()->route('panel-room-type-index', parent::localeAndTenantArray())->with('error', 'Room type not found');
        }

        $roomType = RoomTypeModel::where('id', $roomTypeId)->first();
        if(!$roomType){
            return redirect()->route('panel-room-type-index', parent::localeAndTenantArray())->with('error', 'Room type not found');
        }

        // Update room type basic info
        $roomType->update([
            'name_pt' => $request->name_pt,
            'name_en' => $request->name_en,
            'name_es' => $request->name_es,
            'name_fr' => $request->name_fr,
            'description_pt' => $request->description_pt,
            'description_en' => $request->description_en,
            'description_es' => $request->description_es,
            'description_fr' => $request->description_fr,
            'slug_pt' => Str::slug($request->name_pt),
            'slug_en' => Str::slug($request->name_en),
            'slug_es' => Str::slug($request->name_es),
            'slug_fr' => Str::slug($request->name_fr),
        ]);

        // Update comodites - delete existing and create new ones
        RoomComoditeModel::where('room_type_id', $roomType->id)->delete();
        if ($request->comodites) {
            foreach ($request->comodites as $comoditeId) {
                RoomComoditeModel::create([
                    'room_type_id' => $roomType->id,
                    'comodite_id' => $comoditeId,
                ]);
            }
        }

        // Enforce total max 10 gallery images per room type
        $existingGalleryCount = RoomGalleryModel::where('room_type_id', $roomType->id)->count();
        $newGalleryCount = is_array($request->gallery) ? count($request->gallery) : 0;
        if (($existingGalleryCount + $newGalleryCount) > 10) {
            return back()->withErrors(['gallery' => 'You can have a maximum of 10 gallery images per room type.'])->withInput();
        }

        // Update gallery - add new files if provided (preserve existing ones)
        if ($request->gallery && count($request->gallery) > 0) {
            $tenantId = $this->getTenantId();
            foreach ($request->gallery as $gallery) {
                $filePath = TenantFileAction::save($tenantId, $gallery, true, 'room/gallery');
                RoomGalleryModel::create([
                    'room_type_id' => $roomType->id,
                    'type' => $filePath->type,
                    'src' => $filePath->url,
                ]);
            }
        }

        return redirect()->route('panel-room-type-index', parent::localeAndTenantArray())->with('success', 'Room type Updated Successfully');
    }

    public function destroy(string $tenantId, string $roomTypeIdHashed)
    {
        $roomTypeId = EasyHashAction::decode($roomTypeIdHashed, 'room-type-id');
        if(!$roomTypeId){
            return redirect()->route('panel-room-type-index', parent::localeAndTenantArray())->with('error', 'Room type not found');
        }

        $roomType = RoomTypeModel::with('galleries')->where('id', $roomTypeId)->first();
        if(!$roomType){
            return redirect()->route('panel-room-type-index', parent::localeAndTenantArray())->with('error', 'Room type not found');
        }

        // Delete gallery files from storage first
        if ($roomType->galleries) {
            foreach ($roomType->galleries as $gallery) {
                // Debug the URL parsing
                $debugInfo = TenantFileAction::debugUrlParsing($this->getTenantId(), $gallery->src, true);
                Log::info('Debug file deletion info', $debugInfo);

                $deleted = TenantFileAction::delete($this->getTenantId(), fileUrl: $gallery->src, isPublic: true);
                if (!$deleted) {
                    Log::warning('Failed to delete gallery file', [
                        'tenant_id' => $this->getTenantId(),
                        'gallery_id' => $gallery->id,
                        'file_url' => $gallery->src,
                        'debug_info' => $debugInfo
                    ]);
                } else {
                    Log::info('Gallery file deleted successfully', [
                        'tenant_id' => $this->getTenantId(),
                        'gallery_id' => $gallery->id,
                        'file_url' => $gallery->src
                    ]);
                }
            }
        }

        // Delete related data first (cascade will handle most, but we'll be explicit)
        RoomComoditeModel::where('room_type_id', $roomType->id)->delete();
        RoomGalleryModel::where('room_type_id', $roomType->id)->delete();

        // Delete the room type
        $roomType->delete();

        return redirect()->route('panel-room-type-index', parent::localeAndTenantArray())->with('success', 'Room type deleted successfully');
    }

    public function destroyGallery(string $tenantId, string $roomTypeIdHashed, string $galleryIdHashed)
    {
        $roomTypeId = EasyHashAction::decode($roomTypeIdHashed, 'room-type-id');
        $galleryId = EasyHashAction::decode($galleryIdHashed, 'room-gallery-id');

        if(!$roomTypeId || !$galleryId){
            return back()->with('error', 'Invalid parameters');
        }

        $gallery = RoomGalleryModel::where('id', $galleryId)
            ->where('room_type_id', $roomTypeId)
            ->first();

        if(!$gallery){
            return back()->with('error', 'Gallery not found');
        }

        // Delete the file from storage (gallery files are public)
        // Debug the URL parsing
        $debugInfo = TenantFileAction::debugUrlParsing($this->getTenantId(), $gallery->src, true);
        Log::info('Debug gallery file deletion info', $debugInfo);

        $deleted = TenantFileAction::delete($this->getTenantId(), fileUrl: $gallery->src, isPublic: true);

        if (!$deleted) {
            Log::warning('Failed to delete gallery file', [
                'tenant_id' => $this->getTenantId(),
                'gallery_id' => $gallery->id,
                'file_url' => $gallery->src,
                'debug_info' => $debugInfo
            ]);
        } else {
            Log::info('Gallery file deleted successfully', [
                'tenant_id' => $this->getTenantId(),
                'gallery_id' => $gallery->id,
                'file_url' => $gallery->src
            ]);
        }

        // Delete the gallery record
        $gallery->delete();

        return back()->with('success', 'Image deleted successfully');
    }
}
