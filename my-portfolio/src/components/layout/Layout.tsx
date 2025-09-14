import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import ThemeToggle from './ThemeToggle';
import SideMenu from './SideMenu';
import SocialFooter from './SocialFooter';
import LangToggle from './LangToggle';
import '../../style/layout.css';

const Layout: React.FC = () => {
    const { theme } = useTheme();
    const { pathname } = useLocation();
    const isHome = pathname === '/';
    return (
        <div className={`app-shell ${isHome ? 'is-home' : ''}`}>
            <div className={`app-shell ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
                <SideMenu />
                <ThemeToggle />
                <LangToggle />
                <main className="page-container">
                    <Outlet />
                </main>
                <SocialFooter />
            </div>
        </div>
    );
};

export default Layout;
