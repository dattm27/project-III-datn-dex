import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {ConnectWallet} from 'src/components/ConnectWalletButton';
import { PATHS } from 'src/routes';
import { APP_NAME } from 'src/constants';
import './styles.scss';

const Header: React.FC = () => {
    const location = useLocation(); 
    const isActive = (path: string) => location.pathname === path;
    return (
        <nav className="header">
            <div className="header__logo" >
                <img src="src/assets/icon.png" alt="Logo" className="header__logo-icon" />
                <h1>{APP_NAME}</h1>
            </div>

            <div className="header__nav-links">
                <Link to={PATHS.HOME} className={`header__link  ${isActive(PATHS.HOME) ? 'active' : ''}`}>Home</Link>
                <Link to={PATHS.EXPLORE} className={`header__link  ${isActive(PATHS.EXPLORE) ? 'active' : ''}`}>Explore</Link>
                <Link to={PATHS.POOL} className={`header__link  ${isActive(PATHS.POOL) ? 'active' : ''}`}>Pool</Link>
            </div>

            <div className="header__wallet-button">
                <ConnectWallet />
            </div>
        </nav>
    );
};


export default Header;