import RoomType from "./roomType";
import RoomComodite from "./roomComodite";
import RoomGallery from "./roomGallery";
import RoomPrice from "./roomPrice";

export interface Room {
    id: string;
    room_type_id?: string;
    number: number;
    max_adults?: number;
    max_children?: number;
    max_infants?: number;
    max_pets?: number;
    overview_name_pt?: string;
    overview_name_en?: string;
    overview_name_es?: string;
    overview_name_fr?: string;
    overview_description_pt?: string;
    overview_description_en?: string;
    overview_description_es?: string;
    overview_description_fr?: string;
    created_at?: string;
    updated_at?: string;
    room_type?: RoomType;
    prices?: RoomPrice[];
    galleries?: RoomGallery[];
    comodites?: RoomComodite[];
}
