import React from 'react';

const SideMenu: React.FC = () => {
    return (
        <nav className="nav-box" aria-label="Side menu">
            <input type="checkbox" id="menu" />
            <label htmlFor="menu" className="line"><div className="menu" /></label>
            <div className="menu-list">
                <ul>
                    <li><b><a href="/"><i className="fa fa-home"></i>Home</a></b></li>
                    <li><b><a href="/projects"><i className="fa fa-chevron-circle-right"></i>Projects</a></b></li>
                    <li><b><a href="/certificate"><i className="fa fa-certificate"></i> Certificate</a></b></li>
                    <li><b><a href="/travel-record"><i className="fa fa-image"></i> Travel Record</a></b></li>

                </ul>
            </div>
        </nav>
    );
};

export default SideMenu;
