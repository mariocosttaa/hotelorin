import comodite from "./comodite";
import RoomType from "./roomType";
import RoomGallery from "./roomGallery";
import RoomPrice from "./roomPrice";

export default interface Room {
    id: number;
    room_type_id: number;
    max_adults: number;
    max_children: number;
    max_infants: number;
    max_pets: number;
    name: string;
    description: string;
    room_type?: RoomType;
    comodites?: comodite[];
    galleries?: RoomGallery[];
    prices?: RoomPrice[];
}
