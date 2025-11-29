
import { useCallback } from 'react';
import { translations } from '../pages/lib/translations';

type LanguageCode = keyof typeof translations;

export const useTranslations = (lang: string) => {
  const t = useCallback((key: string): string => {
    // Ensure the lang code is a valid key, otherwise default to 'PT'
    const langKey: LanguageCode = lang in translations ? (lang as LanguageCode) : 'PT';
    
    // Cast to Record<string, string> to allow string indexing
    const dictionary = translations[langKey] as Record<string, string>;
    const fallbackDictionary = translations['PT'] as Record<string, string>;

    const translation = dictionary?.[key];
    const fallback = fallbackDictionary?.[key];

    return translation || fallback || key;
  }, [lang]);

  return { t };
};
