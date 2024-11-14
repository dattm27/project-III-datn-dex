import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/87030/datn-dex/version/latest', //URL to the Graph Query API
  cache: new InMemoryCache(),
});

export default client;
