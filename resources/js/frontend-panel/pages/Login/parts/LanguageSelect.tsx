import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { useTranslation } from 'react-i18next';
import i18n from '@/js/shared/lang/i18n';
import React from 'react';
import { router } from '@inertiajs/react';

interface LanguageSelectProps {
  className?: string;
  value?: string;
  onChange?: (lng: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ className = '', value, onChange }) => {
  const { t: __ } = useTranslation(['static-text']);
  const LANGUAGES = [
    { code: 'pt', name: __('Portuguese', { ns: 'static-text' }), flag: '/assets/images/pt.svg' },
    { code: 'en', name: __('English', { ns: 'static-text' }), flag: '/assets/images/gb.svg' },
    { code: 'es', name: __('Spanish', { ns: 'static-text' }), flag: '/assets/images/es.svg' },
    { code: 'fr', name: __('French', { ns: 'static-text' }), flag: '/assets/images/fr.svg' },
  ];

  const handleChange = (lng: string) => {
    if (onChange) {
      onChange(lng);
    } else {
      const url = new URL(window.location.href);
      const pathParts = url.pathname.split('/');
      pathParts[1] = lng;
      url.pathname = pathParts.join('/');
      i18n.changeLanguage(lng);
      const currentScrollPosition = window.scrollY;
      router.visit(url.toString(), {
        preserveScroll: true,
        onSuccess: () => window.scrollTo(0, currentScrollPosition),
      });
    }
  };

  return (
    <Select value={value || i18n.language} onValueChange={handleChange}>
      <SelectTrigger className={`w-48 border-0 bg-transparent text-base focus:ring-2 focus:ring-[#e2af04] ${className}`}>
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGES.find(l => l.code === (value || i18n.language))?.flag}
            alt={value || i18n.language}
            className="h-5 w-5 rounded-full border"
          />
          <span className="font-medium whitespace-nowrap">
            {LANGUAGES.find(l => l.code === (value || i18n.language))?.name.split(' ')[0]}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map(lang => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <img src={lang.flag} alt={lang.code} className="h-5 w-5 rounded-full border mr-2" />
              <span>{lang.name.split(' ')[0]}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;
