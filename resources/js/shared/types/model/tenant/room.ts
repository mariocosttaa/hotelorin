import RoomType from "./roomType";
import RoomComodite from "./roomComodite";
import RoomGallery from "./roomGallery";
import RoomPrice from "./roomPrice";

export default interface Room {
    id: string;
    room_type_id?: string;

    // Basic room info
    max_adults: number;
    max_children: number;
    max_infants: number;
    max_pets: number;

    // Name and description (inherited from room type if not set)
    name: string;
    description: string;

    // Raw data for editing (room-specific overrides)
    overview_name_pt?: string;
    overview_name_en?: string;
    overview_name_es?: string;
    overview_name_fr?: string;
    overview_description_pt?: string;
    overview_description_en?: string;
    overview_description_es?: string;
    overview_description_fr?: string;

    // Room type relationship
    room_type?: RoomType;

    // Full data (own + inherited) for display
    galleries?: RoomGallery[];
    comodites?: RoomComodite[];
    prices?: RoomPrice[];

    // Room-specific data only (for editing)
    own_galleries?: RoomGallery[];
    own_comodites?: RoomComodite[];
    own_prices?: RoomPrice[];

    // Inherited data from room type
    inherited_galleries?: RoomGallery[];
    inherited_comodites?: RoomComodite[];
    inherited_prices?: RoomPrice[];

    created_at?: string;
    updated_at?: string;
}
