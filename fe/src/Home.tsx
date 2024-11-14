import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navbar from './components/Navbar';
import Explore from './pages/Explore';
import { ApolloProvider } from '@apollo/client';

import client from './apollo-client';
//import './App.css'; //default css
import { WagmiProvider } from "wagmi";

import { AuthProvider } from './contexts';
import { config } from './web3/config';
const queryClient = new QueryClient();
const App: React.FC = () => {
  return (

    <ApolloProvider client={client}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>

            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<div>Home Page</div>} />
                <Route path="/explore" element={<Explore />} />

              </Routes>
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ApolloProvider>
  );
};

export default App;
