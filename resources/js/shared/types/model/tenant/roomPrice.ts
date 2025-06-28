import Currency from "./currency";
import Room from "./room";
import RoomType from "./roomType";

export default interface RoomPrice {
    id: string;
    room_type_id?: string;
    room_id?: string;
    use_type_price_in_room: boolean;
    currency_code: string;
    price: number;
    price_ilustrative?: number;
    status: boolean;
    price_formatted?: string;
    price_ilustrative_formatted?: string;
    created_at?: string;
    updated_at?: string;
    currency?: Currency;
    room?: Room;
    room_type?: RoomType;
}
