import React, { useEffect, useState } from 'react';

const SocialFooter: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<string>('');

    // 即時時間
    useEffect(() => {
        function tick() {
            const today = new Date();
            const yyyy = today.getFullYear();
            const MM = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const hh = String(today.getHours()).padStart(2, '0');
            const mm = String(today.getMinutes()).padStart(2, '0');
            const ss = String(today.getSeconds()).padStart(2, '0');
            const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const day = weekdays[today.getDay()];
            setCurrentTime(`${yyyy}/${MM}/${dd} ${hh}:${mm}:${ss} ${day}`);
            setTimeout(tick, 1000);
        }
        tick();
    }, []);

    return (
        <>
            <div className="bottom-time" />
            <footer className="social-footer" aria-label="Social links">
                <div className="bottom-time text-center">
                    <h6>Current Time (UTC-4, NY Time) : <span>{currentTime}</span></h6>
                </div>
                <nav className="social-nav">
                    <a className="social-link" href="https://www.linkedin.com/in/jason-chen-030669381/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a
                        className="social-link"
                        href="https://github.com/jason980102"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <i className="fab fa-github"></i>
                    </a>
                    <a className="social-link" href="https://www.instagram.com/jason03710/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a
                        className="social-link"
                        href="mailto:jason980102@gmail.com"
                        aria-label="Email"
                    >
                        <i className="fas fa-envelope"></i>
                    </a>
                </nav>
            </footer>
        </>
    );
};

export default SocialFooter;
