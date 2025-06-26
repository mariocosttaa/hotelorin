import Currency from "./currency";
import Room from "./room";

export default interface RoomPrice {
    currency_code: string;
    price: number;
    price_formatted: string;
    price_ilustrative?: number;
    price_ilustrative_formatted?: string;
    status: boolean;
}
