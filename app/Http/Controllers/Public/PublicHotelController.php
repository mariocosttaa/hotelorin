<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Manager\TenantModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicHotelController extends Controller
{
    public function index(string $hotelSlug): \Inertia\Response
    {

        $hotel = TenantModel::where('slug', $hotelSlug)->first();
        if (!$hotel) {
            abort(404);
        }

        return Inertia::render('frontend-public/template-default/pages/Home/PublicHome', [
            'hotel' => 'Hotel 1',
        ]);
    }
}
