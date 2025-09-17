import React, { useEffect, useState } from 'react';
import { useLang } from './layout/LangProvider';
import '../style/Certificate.css';

type I18nText = { en: string; zh: string };
type Cert = {
    id: string;
    title: I18nText;
    desc?: I18nText;        // 下方介紹
    date?: string;
    tags?: string[];
    src: string;            // 縮圖/主圖（16:9 框內顯示）
    fileUrl?: string;       // 原始檔（PDF/JPG/外部連結）
};

type Raw = Partial<Cert> & { title?: any; desc?: any };

const asI18n = (v: any): I18nText =>
    typeof v === 'string' ? ({ en: v, zh: v }) :
        ({ en: String(v?.en ?? v?.zh ?? ''), zh: String(v?.zh ?? v?.en ?? '') });

const norm = (r: Raw): Cert | null => {
    if (!r?.id || !r?.src) return null;
    return {
        id: String(r.id),
        src: String(r.src),
        title: asI18n(r.title ?? ''),
        desc: r.desc ? asI18n(r.desc) : undefined,
        date: r.date ? String(r.date) : undefined,
        tags: Array.isArray(r.tags) ? r.tags.map(String) : undefined,
        fileUrl: r.fileUrl ? String(r.fileUrl) : undefined,
    };
};

const Certificate: React.FC = () => {
    const { lang } = useLang();
    const [items, setItems] = useState<Cert[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<Cert | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                const res = await fetch(`/data/certificates.json?ts=${Date.now()}`, { cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const list: Cert[] = (Array.isArray(data?.certificates) ? data.certificates : [])
                    .map(norm)
                    .filter((x: Cert | null): x is Cert => x !== null);

                // ← 這裡補型別
                list.sort((a: Cert, b: Cert) => (b.date ?? '').localeCompare(a.date ?? ''));

                setItems(list);
            } catch (e: any) {
                setError(e?.message || '載入失敗');
            }
        })();
    }, []);
    // 依圖片天然寬高設定 orientation，直式就用 contain
    const onImgLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
        const img = e.currentTarget;
        img.dataset.orientation = img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape';
    };

    return (
        <div className="cert-container">
            <h1 className="cert-title">Certificates｜檔案證明</h1>
            {error && <div className="cert-error">Error: {error}</div>}

            <div className="cert-grid">
                {items.map(it => (
                    <article key={it.id} className="cert-card" onClick={() => setView(it)} role="button" tabIndex={0}>
                        <div className="thumb">
                            <img src={it.src} alt={it.title[lang]} loading="lazy" onLoad={onImgLoad} />
                        </div>
                        <div className="meta">
                            <h3 className="title">{it.title[lang]}</h3>
                            {(it.desc?.[lang] || it.date) && (
                                <div className="desc">
                                    {it.desc?.[lang]}{it.desc?.[lang] && it.date ? ' · ' : ''}{it.date}
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {view && (
                <div className="lightbox" onClick={() => setView(null)}>
                    <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
                        <img src={view.src} alt={view.title[lang]} />
                        <div className="lightbox-text">
                            <h3>{view.title[lang]}</h3>
                            {view.desc?.[lang] && <div className="lightbox-desc" dangerouslySetInnerHTML={{ __html: view.desc[lang] }} />}
                            {view.date && <div className="lightbox-date">{view.date}</div>}
                            {view.fileUrl && (
                                <a className="file-btn" href={view.fileUrl} target="_blank" rel="noreferrer">
                                    檢視原檔
                                </a>
                            )}
                        </div>
                        <button className="lightbox-close" onClick={() => setView(null)} aria-label="Close">×</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificate;

export { };