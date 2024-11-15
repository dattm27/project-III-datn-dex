import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from './components/Layout';
import { ApolloProvider } from '@apollo/client';

import client from './apollo-client';
//import './App.css'; //default css
import { WagmiProvider } from "wagmi";

import { AuthProvider } from './contexts';
import { config } from './web3/config';
import { routes } from "./routes";

const queryClient = new QueryClient();
const App: React.FC = () => {
  return (

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
  );
};

export default App;
