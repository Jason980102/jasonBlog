import React from 'react';
import { useLang } from './LangProvider';

const LangToggle: React.FC = () => {
    const { lang, toggle } = useLang();
    return (
        <button
            type="button"
            className="lang-toggle-button"
            onClick={toggle}
            aria-label={lang === 'en' ? '切換為中文' : 'Switch to English'}
            title={lang === 'en' ? '切換為中文' : 'Switch to English'}
        >
            {lang === 'en' ? '中文' : 'English'}
        </button>
    );
};

export default LangToggle;