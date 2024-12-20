import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from './components/Layout';
import { ApolloProvider } from '@apollo/client';

import client from './apollo-client';
import './App.css'; //default css
import { WagmiProvider } from "wagmi";

import { AuthProvider } from './contexts';
import { config } from './web3/config';
import { routes } from "./routes";
import { APP_NAME } from './constants';

const queryClient = new QueryClient();
const App: React.FC = () => {
  useEffect(() => {
    document.title = APP_NAME;
  }, []);
  return (
    <div className='gradient-background'>
       <ApolloProvider client={client}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>

            <Router>
              <Layout>
                <Routes>
                  {routes.map((item) => (
                    <Route key={item.path} {...item} />
                  ))}
                </Routes>
              </Layout>
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ApolloProvider>
    </div>
  );
};

export default App;
