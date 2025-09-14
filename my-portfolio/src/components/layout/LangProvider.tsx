import React, { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'en' | 'zh';
type Ctx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void };

const LangCtx = createContext<Ctx>({ lang: 'en', setLang: () => { }, toggle: () => { } });

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');
    useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);
    const toggle = () => setLang(l => (l === 'en' ? 'zh' : 'en'));
    return <LangCtx.Provider value={{ lang, setLang, toggle }}>{children}</LangCtx.Provider>;
};

export const useLang = () => useContext(LangCtx);
