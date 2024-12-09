import React from 'react';
import { Link } from 'react-router-dom';

import {ConnectWallet} from 'src/components/ConnectWalletButton';
import { PATHS } from 'src/routes';
import { APP_NAME } from 'src/constants';
import './styles.scss';

export const Header: React.FC = () => {
    return (
        <nav className="header">
            {/* Logo */}
            <div className="header__logo" >
                <img src="src/assets/images/icon.svg" alt="Logo" className="header__logo-icon" />
                <h1>{APP_NAME}</h1>
            </div>

            {/* Navigation Links */}
            <div className="header__nav-links">
                <Link to={PATHS.HOME} className="header__link">Home</Link>
                <Link to={PATHS.EXPLORE} className="header__link">Explore</Link>
                <Link to={PATHS.POOL} className="header__link">Pool</Link>
            </div>

            {/* Connect Wallet Button */}
            <div className="header__wallet-button">
                <ConnectWallet />
            </div>
        </nav>
    );
};


