import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/Blog.css';

interface Issue {
    id: number;
    title: string;
    body: string;
    html_url: string;
}

const Blog: React.FC = () => {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await axios.get(
                    'https://api.github.com/repos/Jason980102/jasonLeaveSystem/issues'
                );
                setIssues(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching issues');
                setLoading(false);
            }
        };

        //抓取當前時間
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
            if (today.getDay() === 0) day = "星期日 ";
            if (today.getDay() === 1) day = "星期一 ";
            if (today.getDay() === 2) day = "星期二 ";
            if (today.getDay() === 3) day = "星期三 ";
            if (today.getDay() === 4) day = "星期四 ";
            if (today.getDay() === 5) day = "星期五 ";
            if (today.getDay() === 6) day = "星期六 ";
            var nowDateTimeSpan = document.getElementById('nowDateTimeSpan');
            if (nowDateTimeSpan) {
                nowDateTimeSpan.innerHTML = yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss + "   " + day;
            }
            setTimeout(startTime, 1000);
        }

        function checkTime(i: number): string {
            if (i < 10) {
                return "0" + i;
            }
            return i.toString();
        }

        startTime();
        fetchIssues();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.pageYOffset > 150);
        };

        window.addEventListener('scroll', handleScroll);
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
            <div className="theme-toggle-button" onClick={toggleTheme}>
                {isDarkMode ? '🌙' : '☀️'}
            </div>
            <div className="blog-container">
                <h1 className="blog-title">Jason's Blog</h1>
                <img src="/Turtle.jpg" alt="Avatar" className="avatar" />
                {error && <div>Error: {error}</div>}
                <ul className="blog-list">
                    {issues.map((issue) => (
                        <li key={issue.id} className="blog-item">
                            <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                                {issue.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <nav className="nav-box">
                <input type="checkbox" id="menu" />
                <label htmlFor="menu" className="line">
                    <div className="menu"></div>
                </label>
                <div className="menu-list">
                    <ul>
                        <li><b><a href="/" style={{ color: 'rgb(255, 255, 255)' }}><i className="fa fa-home"></i>Home</a></b></li>
                        <li><b><a href="Blog" style={{ color: 'rgb(255, 255, 255)' }}><i className="fa fa-chevron-circle-right"></i>Blog</a></b></li>
                        <li><b><a href="俄羅斯方塊製作步驟.html" style={{ color: 'rgb(255, 255, 255)' }}><i className="fa fa-chevron-circle-right"></i>Work</a></b></li>
                    </ul>
                </div>
            </nav>

            <div className="bottom-container">
                <div className="bottom-info text-center">
                    <h6>與我聯繫</h6>
                    <hr />
                </div>
                <ul className="button">
                    <li className="icon"><a href="https://www.facebook.com/profile.php?id=100006924015388" className="fa fa-facebook"></a></li>
                    <li className="icon"><a href="https://www.instagram.com/jason980102/" className="fa fa-instagram"></a></li>
                    <li className="icon"><a href="https://www.youtube.com/channel/UCZK96SXgP-jAT6jApI1FeUg" className="fa fa-youtube"></a></li>
                    <li className="icon"><a href="mailto:u11010012@go.utaipei.edu.tw" className="fa fa-envelope" style={{ fontSize: '25px' }}></a></li>
                </ul>
                <div className="bottom-info text-center">
                    <h6>當前時間：<span id="nowDateTimeSpan"></span></h6>
                </div>
            </div>
            <div className="block">
                <h2 className="shape">作品集</h2>
                <div className=" justify-content-center">
                    <h6>Hi, 我是Jason, 目前就讀台北市立大學資訊科學系三年級, 目前的目標是要推甄研究所或是去國外念研究所。</h6>
                    <h6>我其實是轉系生，我原本的系所是地球環境暨生物資源學系，而我在大一升大二的時候轉到資訊科學系，也就一直讀到現在，雖然很累，但是蠻值得的，因為我終於找到我歸屬的地方了。</h6>
                </div>
            </div>
            <div className="block">
                <h2 className="shape">作品集</h2>
                <div className=" justify-content-center">
                    <h6>Hi, 我是Jason, 目前就讀台北市立大學資訊科學系三年級, 目前的目標是要推甄研究所或是去國外念研究所。</h6>
                    <h6>我其實是轉系生，我原本的系所是地球環境暨生物資源學系，而我在大一升大二的時候轉到資訊科學系，也就一直讀到現在，雖然很累，但是蠻值得的，因為我終於找到我歸屬的地方了。</h6>
                </div>
            </div>
            <div className="block">
                <h2 className="shape">作品集</h2>
                <div className=" justify-content-center">
                    <h6>Hi, 我是Jason, 目前就讀台北市立大學資訊科學系三年級, 目前的目標是要推甄研究所或是去國外念研究所。</h6>
                    <h6>我其實是轉系生，我原本的系所是地球環境暨生物資源學系，而我在大一升大二的時候轉到資訊科學系，也就一直讀到現在，雖然很累，但是蠻值得的，因為我終於找到我歸屬的地方了。</h6>
                </div>
            </div>
            <button className={`fas fa-angle-up scroll-to-top ${showScrollToTop ? 'show' : ''}`} onClick={scrollToTop}></button>
        </div>
    );
};

export default Blog;
