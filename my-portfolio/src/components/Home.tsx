import React, { useEffect, useState, useRef } from 'react';
import '../style/Home.css';
import { useLang } from './layout/LangProvider'
type I18nText = { en: string; zh: string };
type Block = { id: string; title: I18nText; content: I18nText };

function asI18nText(v: any): I18nText {
    // 支援舊格式：如果是字串 -> 視為中文，同步放到英文，避免空白
    if (typeof v === 'string') return { en: v, zh: v };
    // 新格式：優先使用，缺的語言用另一個補上
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

    // Avatar / icons 漸入
    useEffect(() => {
        const timer = setTimeout(() => {
            document.querySelector('.avatar')?.classList.add('show');
            document.querySelectorAll('.icon').forEach(el => el.classList.add('show'));
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    //load blocks.json
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

    // Block 進場
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

        // 立即檢查目前就已在視窗內的
        const vh = window.innerHeight || document.documentElement.clientHeight;
        blockRefs.current.forEach((ref) => {
            if (!ref) return;
            const r = ref.getBoundingClientRect();
            if (r.top < vh && r.bottom > 0) ref.classList.add('visible');
        });

        return () => blockRefs.current.forEach((ref) => ref && observer.unobserve(ref));
    }, [blocks]);

    // 回到頂端按鈕
    useEffect(() => {
        const handleScroll = () => setShowScrollToTop(window.scrollY > 150);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <div className="main-container route-home">
            <img src="/JSBG.jpg" className="background-image" alt="" />
            <div className="hero">
                <img src="/profilepicscalelarge.jpg" alt="Avatar" className="avatar avatar-overlap" />
            </div>

            <h1 className="blog-title">Jason Chen</h1>

            {blocks.map((b, idx) => (
                <div
                    key={b.id ?? idx}
                    ref={el => (blockRefs.current[idx] = el)}
                    className={`block ${idx % 2 === 0 ? 'block--rtl' : 'block--ltr'}`}
                >
                    <h2 className={`shape ${idx % 2 !== 1 ? 'title-right' : ''}`}>
                        {b.title[lang]}
                    </h2>
                    <div className="content" dangerouslySetInnerHTML={{ __html: b.content[lang] }} />
                </div>
            ))}


            {/* 回頂按鈕 */}
            {showScrollToTop && (
                <button onClick={scrollToTop} className="scroll-to-top" aria-label="Scroll to top">
                    ↑
                </button>
            )}
        </div>


    );
};



export default Home;
