import React from 'react';
import SwapModal from '../PoolDetails/SwapModal';

export const Home: React.FC = () => {
  return (
    <div  style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',    
    }} className='page'>
      {/* <h1>Swap anytime, anywhere.</h1> */}
      <SwapModal/>
    </div>
  );
};


