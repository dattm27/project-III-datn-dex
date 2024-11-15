import React from 'react';
import { Link } from 'react-router-dom';
import { WalletConnectButton } from 'src/components/ConnectWalletButton';
import { PATHS } from 'src/routes';

export const Header: React.FC = () => {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#f8f8f8' }}>
         <Link to={PATHS.HOME}>Home</Link>
        <Link to={PATHS.EXPLORE}>Explore</Link>
        <Link to={PATHS.POOL}>Pool</Link>
      <div>
        <WalletConnectButton/>
      </div>
    </nav>
  );
};


