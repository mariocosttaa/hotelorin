import Room from "./room";
import RoomType from "./roomType";

export default interface RoomGallery {
    id: string;
    room_type_id?: string;
    room_id?: string;
    use_type_gallery_in_room: boolean;
    type: string;
    src: string;
    created_at?: string;
    updated_at?: string;
    room?: Room;
    room_type?: RoomType;
}
