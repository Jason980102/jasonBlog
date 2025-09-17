import React, { useEffect, useState, useRef } from 'react';
import '../style/Home.css';
import { useLang } from './layout/LangProvider';

type I18nText = { en: string; zh: string };
type Block = { id: string; title: I18nText; content: I18nText };

function asI18nText(v: any): I18nText {
    if (typeof v === 'string') return { en: v, zh: v };
    const en = (v?.en ?? v?.zh ?? '').toString();
    const zh = (v?.zh ?? v?.en ?? '').toString();
    return { en, zh };
}

function normalizeBlock(raw: any): Block | null {
    if (!raw?.id) return null;
    return {
        id: String(raw.id),
        title: asI18nText(raw.title),
        content: asI18nText(raw.content),
    };
}

const Home: React.FC = () => {
    const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
    const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { lang } = useLang();
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [blocksError, setBlocksError] = useState<string | null>(null);

    // 首屏區塊（16:9 hero）用來計算滾動進度
    const heroRef = useRef<HTMLDivElement | null>(null);
    // 不影響你既有的動畫，但讓它一載入就能跟著滾動
    const [engaged, setEngaged] = useState(true);

    // Avatar / icons 漸入（保留）
    useEffect(() => {
        const timer = setTimeout(() => {
            document.querySelector('.avatar')?.classList.add('show');
            document.querySelectorAll('.icon').forEach(el => el.classList.add('show'));
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // 載入 blocks.json（保留）
    useEffect(() => {
        (async () => {
            try {
                setBlocksError(null);
                const res = await fetch(`/data/blocks.json?ts=${Date.now()}`, { cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const list: Block[] = (Array.isArray(data?.blocks) ? data.blocks : [])
                    .map(normalizeBlock)
                    .filter((x: any): x is Block => !!x);
                const seen = new Set<string>();
                const unique = list.filter(b => (seen.has(b.id) ? false : (seen.add(b.id), true)));
                setBlocks(unique);
            } catch (e: any) {
                setBlocksError(e?.message || '載入失敗');
            }
        })();
    }, []);

    // Block 進場（保留）
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.0, root: null, rootMargin: '0px 0px -10% 0px' }
        );

        blockRefs.current.forEach((ref) => ref && observer.observe(ref));

        const vh = window.innerHeight || document.documentElement.clientHeight;
        blockRefs.current.forEach((ref) => {
            if (!ref) return;
            const r = ref.getBoundingClientRect();
            if (r.top < vh && r.bottom > 0) ref.classList.add('visible');
        });

        return () => blockRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    }, [blocks]);

    // 依滾動更新全域 CSS 變數 --hero-p，0（在頂）→ 1（滑過整個 16:9 首屏）
    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        const onScroll = () => {
            const rect = el.getBoundingClientRect();
            const h = rect.height || 1;
            const p = Math.max(0, Math.min(1, -rect.top / h));
            // 設在 hero 本身與 :root 兩邊，方便 overlay 與 sticky 都吃得到
            el.style.setProperty('--p', String(p));
            document.documentElement.style.setProperty('--hero-p', String(p));
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // 回到頂端按鈕（保留）
    useEffect(() => {
        const handleScroll = () => setShowScrollToTop(window.scrollY > 150);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToFirstContent = () => {
        const el = document.querySelector('.home-block') as HTMLElement | null;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 8;
        window.scrollTo({ top, behavior: 'smooth' });
    };

    const onHeroWheel: React.WheelEventHandler = (e) => {
        if (e.deltaY > 0) scrollToFirstContent(); // 往下滾才觸發
    };

    return (
        <div className="main-container route-home">
            <section
                className="hero-16x9"
                ref={heroRef}
                onClick={scrollToFirstContent}
                onWheel={onHeroWheel}
                onTouchEnd={scrollToFirstContent}
            >
                <img src={`${process.env.PUBLIC_URL}/liberty.jpg`} className="hero-img" alt="" />

                <div className="hero-overlay">
                    <img src="/profilepicscalelarge.jpg" alt="Avatar" className="avatar hero-avatar" />
                    <h1 className="hero-name">Jason Chen</h1>
                </div>
            </section>

            {/* 內容區塊 */}
            {blocks.map((b, idx) => (
                <div
                    key={b.id ?? idx}
                    ref={el => { blockRefs.current[idx] = el; }}
                    className={`home-block ${idx % 2 === 0 ? 'home-block--rtl' : 'home-block--ltr'}`}
                >
                    <h2 className={`shape ${idx % 2 !== 1 ? 'title-right' : ''}`}>{b.title[lang]}</h2>
                    <div className="content" dangerouslySetInnerHTML={{ __html: b.content[lang] }} />
                </div>
            ))}

            {showScrollToTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="scroll-to-top"
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}
        </div>
    );
};

export default Home;
