import RoomComodite from "./roomComodite";
import RoomGallery from "./roomGallery";
import RoomPrice from "./roomPrice";

export default interface RoomType {
    id: string;
    name: string;
    description: string;
    slug: string;

    // Raw data for editing
    name_pt?: string;
    name_en?: string;
    name_es?: string;
    name_fr?: string;
    description_pt?: string;
    description_en?: string;
    description_es?: string;
    description_fr?: string;
    slug_pt?: string;
    slug_en?: string;
    slug_es?: string;
    slug_fr?: string;

    comodites?: RoomComodite[];
    galleries?: RoomGallery[];
    prices?: RoomPrice[];
}
