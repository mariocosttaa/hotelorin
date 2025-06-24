import LanguageSelector from "./LanguageSelector";
import CurrencySelector from "./CurrencySelector";

interface SelectorsGroupProps {
    mobile?: boolean;
    className?: string;
}

function SelectorsGroup({ mobile = false, className = "" }: SelectorsGroupProps) {
    return (
        <div className={`flex items-center ${mobile ? 'space-x-4' : 'space-x-2 lg:space-x-3'} ${className}`}>
            {/* Currency Selector */}
            <CurrencySelector mobile={mobile} />

            {/* Language Selector */}
            <LanguageSelector mobile={mobile} />
        </div>
    );
}

export default SelectorsGroup;
