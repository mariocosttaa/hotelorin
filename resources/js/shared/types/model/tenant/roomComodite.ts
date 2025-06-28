import Comodite from "./comodite";
import Room from "./room";
import RoomType from "./roomType";

export default interface RoomComodite {
    id: string;
    room_type_id?: string;
    room_id?: string;
    use_type_comodites_in_room: boolean;
    comodite_id: string;
    created_at?: string;
    updated_at?: string;
    comodite?: Comodite;
    room?: Room;
    room_type?: RoomType;
}
