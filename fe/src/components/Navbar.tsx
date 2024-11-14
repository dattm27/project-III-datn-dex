import React from 'react';
import { Link } from 'react-router-dom';
import { WalletConnectButton } from './ConnectWalletButton';


const Navbar: React.FC = () => {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#f8f8f8' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
      <Link to="/explore">Explore</Link>
      <div>
        <WalletConnectButton/>
      </div>
    </nav>
  );
};

export default Navbar;
