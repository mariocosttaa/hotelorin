import comodite from "./comodite";
import Room from "./room";
import RoomType from "./roomType";

export default interface RoomComodite {
    id: string;
    room_type_id: string | null;
    room_id: string | null;
    comodite?: comodite;
    room_type?: RoomType;
    room?: Room;
}
