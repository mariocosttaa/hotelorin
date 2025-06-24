import { usePage } from '@inertiajs/react';
import { useCurrency } from '@/js/shared/hooks/useCurrency';
import { InertiaMiddlewareProps } from '@/js/shared/types/Inertia-middleware-prop';
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";

interface CurrencySelectorProps {
    className?: string;
    mobile?: boolean;
}

function CurrencySelector({ className = "", mobile = false }: CurrencySelectorProps) {
    const { currencies, default_currency } = usePage<InertiaMiddlewareProps>().props;
    const { currentCurrencyCode, updateCurrency } = useCurrency();

    const changeCurrency = (code: string) => {
        updateCurrency(code);
    };

    return (
        <Select value={currentCurrencyCode} onValueChange={changeCurrency}>
            <SelectTrigger className={mobile ? "w-20" : "w-16 border-0 bg-transparent text-sm lg:w-20"}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.code}>
                        {currency.code.toUpperCase()}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default CurrencySelector;
