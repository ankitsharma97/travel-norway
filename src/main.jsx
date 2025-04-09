import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider, useMutation, gql } from "@apollo/client";
import RouterComponent from './routes.jsx';

// Apollo Client setup
const client = new ApolloClient({
  uri: 'https://api-qa.seamasterai.com/graphql',
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <RouterComponent />
    </React.StrictMode>
  </ApolloProvider>

)