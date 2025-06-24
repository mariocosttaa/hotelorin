import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "@inertiajs/react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/Select";

export default function SearchSection() {
    const { t: __ } = useTranslation(['static-text']);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState("2");

    return (
        <div className="bg-white shadow-2xl -mt-10 lg:-mt-20 relative z-10 mx-4 lg:mx-8 rounded-xl lg:rounded-2xl p-4 lg:p-8 border border-blue-100">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-end">
                    <div className="space-y-2">
                        <label className="block text-xs lg:text-sm font-semibold text-gray-700">{__('checkIn')}</label>
                        <Input
                            type="date"
                            value={checkIn}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckIn(e.target.value)}
                            className="w-full h-10 lg:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg lg:rounded-xl text-sm lg:text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs lg:text-sm font-semibold text-gray-700">{__('checkOut')}</label>
                        <Input
                            type="date"
                            value={checkOut}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckOut(e.target.value)}
                            className="w-full h-10 lg:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg lg:rounded-xl text-sm lg:text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs lg:text-sm font-semibold text-gray-700">{__('guests')}</label>
                        <Select value={guests} onValueChange={setGuests}>
                            <SelectTrigger className="h-10 lg:h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg lg:rounded-xl text-sm lg:text-base">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 {__('guestsText')}</SelectItem>
                                <SelectItem value="2">2 {__('guestsText')}</SelectItem>
                                <SelectItem value="3">3 {__('guestsText')}</SelectItem>
                                <SelectItem value="4">4 {__('guestsText')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Link href="/room-search" className="sm:col-span-2 lg:col-span-1">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 w-full h-10 lg:h-12 rounded-lg lg:rounded-xl text-sm lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                            {__('searchRooms')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
