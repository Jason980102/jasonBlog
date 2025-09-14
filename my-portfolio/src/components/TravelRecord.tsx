import React, { useEffect, useState } from 'react';
import { useLang } from './layout/LangProvider';
import '../style/TravelRecord.css';

type I18nText = { en: string; zh: string };
type PhotoPost = {
    id: string;
    title: I18nText;
    caption?: I18nText;
    content?: I18nText;
    date?: string;
    album?: string;
    tags?: string[];
    src: string;
};

function asI18nText(v: any): I18nText {
    if (typeof v === 'string') return { en: v, zh: v };
    const en = (v?.en ?? v?.zh ?? '').toString();
    const zh = (v?.zh ?? v?.en ?? '').toString();
    return { en, zh };
}

function normalize(p: any): PhotoPost | null {
    if (!p?.id || !p?.src) return null;
    return {
        id: String(p.id),
        src: String(p.src),
        title: asI18nText(p.title ?? ''),
        caption: p.caption ? asI18nText(p.caption) : undefined,
        content: p.content ? asI18nText(p.content) : undefined,
        date: p.date ? String(p.date) : undefined,
        album: p.album ? String(p.album) : undefined,
        tags: Array.isArray(p.tags) ? p.tags.map(String) : undefined,
    };
}

const TravelRecord: React.FC = () => {
    const { lang } = useLang();
    const [posts, setPosts] = useState<PhotoPost[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<PhotoPost | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setError(null);
                const res = await fetch(`/data/travel-record.json?ts=${Date.now()}`, { cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const arr: PhotoPost[] = (Array.isArray(data?.posts) ? data.posts : [])
                    .map(normalize)
                    .filter((x: PhotoPost | null): x is PhotoPost => !!x);
                arr.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
                setPosts(arr);
            } catch (e: any) {
                setError(e?.message || '載入失敗');
            }
        })();
    }, []);

    return (
        <div className="photos-container">
            <h1 className="photos-title">Travel Record</h1>
            {error && <div className="photos-error">Error: {error}</div>}

            <div className="photo-grid">
                {posts.map(p => (
                    <article key={p.id} className="photo-card" onClick={() => setView(p)} role="button" tabIndex={0}>
                        <div className="thumb">
                            <img src={p.src} alt={p.title?.[lang] || ''} loading="lazy" />
                        </div>
                        <div className="meta">
                            <h3 className="title">{p.title?.[lang]}</h3>
                            {(p.caption?.[lang] || p.date) && (
                                <div className="caption">
                                    {p.caption?.[lang]}{p.caption?.[lang] && p.date ? ' · ' : ''}{p.date}
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {view && (
                <div className="lightbox" onClick={() => setView(null)}>
                    <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
                        <img src={view.src} alt={view.title?.[lang] || ''} />
                        <div className="lightbox-text">
                            <h3>{view.title?.[lang]}</h3>
                            {view.caption?.[lang] && <div className="lightbox-caption">{view.caption[lang]}</div>}
                            {view.content?.[lang] && (
                                <div className="lightbox-content" dangerouslySetInnerHTML={{ __html: view.content[lang] }} />
                            )}
                            {view.date && <div className="lightbox-date">{view.date}</div>}
                        </div>
                        <button className="lightbox-close" onClick={() => setView(null)} aria-label="Close">×</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelRecord;