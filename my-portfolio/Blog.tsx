import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import '../style/Blog.css';

interface Issue {
    id: number;
    title: string;
    body: string;
    html_url: string;
}

//Fetch當前時間
const Blog: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<string>("");
    const [issues, setIssues] = useState<Issue[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
    const blockRefs = useRef<(HTMLLIElement | null)[]>([]);

    useEffect(() => {
        // 定義 GitHub API 端點的 URL
        const apiUrl = 'https://api.github.com/repos/jason980102/jasonBlog/issues';

        // 使用 fetch 函式向 GitHub 的 Issues API 端點發送 GET 請求
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch issues');
                }
                return response.json();
            })
            .then(data => {
                // 從 API 回傳的數據中提取並設定部落格文章的狀態
                setIssues(data);
            })
            .catch(error => {
                // 處理錯誤
                setError(error.message);
            });
    }, []);


    useEffect(() => {
        function startTime() {
            var today = new Date();
            var yyyy: number = today.getFullYear();
            var MM: string = (today.getMonth() + 1).toString(); // 使用 toString() 將月份轉換為字串
            var dd: string = today.getDate().toString();
            var hh: string = today.getHours().toString();
            var mm: string = today.getMinutes().toString();
            var ss: string = today.getSeconds().toString();
            MM = checkTime(parseInt(MM));
            dd = checkTime(parseInt(dd));
            mm = checkTime(parseInt(mm));
            ss = checkTime(parseInt(ss));
            var day: string = "";
            if (today.getDay() == 0) day = "星期日 ";
            if (today.getDay() == 1) day = "星期一 ";
            if (today.getDay() == 2) day = "星期二 ";
            if (today.getDay() == 3) day = "星期三 ";
            if (today.getDay() == 4) day = "星期四 ";
            if (today.getDay() == 5) day = "星期五 ";
            if (today.getDay() == 6) day = "星期六 ";

            setCurrentTime(`${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss} ${day}`);
            setTimeout(startTime, 1000);
        }

        function checkTime(i: number): string {
            if (i < 10) {
                return "0" + i;
            }
            return i.toString();
        }

        startTime();
    }, []);

    //頭像與icon浮現
    useEffect(() => {
        const delay = 2000;
        const timer = setTimeout(() => {
            document.querySelector('.avatar')?.classList.add('show');
            document.querySelectorAll('.icon').forEach(icon => {
                icon.classList.add('show');
            });
            document.querySelectorAll('.block').forEach(icon => {
                icon.classList.add('visible');
            });
        }, delay);

        // 清除定时器
        return () => clearTimeout(timer);
    }, []);

    //Block動態顯示
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });

        blockRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            blockRefs.current.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [issues]);

    const handleScroll = () => {
        setShowScrollToTop(window.scrollY > 150);

        // 获取所有带有 data-index 属性的 li 元素
        const elements = document.querySelectorAll('.blog-list .block[data-index]');
        elements.forEach((element: Element) => {
            const rect = element.getBoundingClientRect();
            const visible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (visible) {
                element.classList.add('show');
            }
        });
    };


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // 初始渲染时也执行一次
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`main-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <img src="/JSBG.jpg" className="background-image" />
            <h1 className="blog-title">Jason's Blog</h1>
            <div className="theme-toggle-button" onClick={toggleTheme}>
                {isDarkMode ? '🌙' : '☀️'}
            </div>
            <div className="blog-container">
                <img src="/Turtleclip.jpg" alt="Avatar" className="avatar" />
                {error && <div>Error: {error}</div>}

            </div>

            <nav className="nav-box">
                <input type="checkbox" id="menu" />
                <label htmlFor="menu" className="line">
                    <div className="menu"></div>
                </label>
                <div className="menu-list">
                    <ul>
                        <li><b><a href="/" style={{ color: 'rgb(255, 255, 255)' }}><i className="fa fa-home"></i>首頁</a></b></li>
                        <li><b><a href="Blog" style={{ color: 'rgb(255, 255, 255)' }}><i className="fa fa-chevron-circle-right"></i>部落格</a></b></li>
                    </ul>
                </div>
            </nav>

            <div className="connect-container">
                <div className="bottom-info text-center">
                    <h5>與我聯繫</h5>
                    <hr />
                </div>
                <ul className="button">
                    <li className="icon"><a href="https://www.facebook.com/profile.php?id=100006924015388" className="fa fa-facebook"></a></li>
                    <li className="icon"><a href="https://www.instagram.com/jason980102/" className="fa fa-instagram"></a></li>
                    <li className="icon"><a href="https://www.youtube.com/channel/UCZK96SXgP-jAT6jApI1FeUg" className="fa fa-youtube"></a></li>
                    <li className="icon"><a href="mailto:u11010012@go.utaipei.edu.tw" className="fa fa-envelope" style={{ fontSize: '25px' }}></a></li>
                </ul>
            </div>

            <div className="main-container">
                {error && <div>Error: {error}</div>}
                <div className="blog-container">
                    <ul className="blog-list">
                        {issues.slice().reverse().map((issue, index) => (
                            <li key={issue.id} data-index={index} className="block">
                                <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="justify-content-center">
                                    {issue.title}
                                </a>
                                <div className="issue-body">
                                    <ReactMarkdown>
                                        {issue.body}
                                    </ReactMarkdown>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button className={`fas fa-angle-up scroll-to-top ${showScrollToTop ? 'show' : ''}`} onClick={scrollToTop}></button>
            <div className="bottom-info text-center">
                <h6>當前時間(TPE,UTC+08:00)：<span>{currentTime}</span></h6>
            </div>
        </div>
    );
};

export default Blog;
