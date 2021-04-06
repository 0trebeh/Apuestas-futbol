import React from 'react';
import './App.css';
import Home from './pages/home';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {persistor, store} from './state-store/store';
import axios from 'axios';

axios.defaults.baseURL = 'http://192.168.0.101:8000';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Switch>
            <Route exact path={'/'}>
              <Home />
            </Route>
          </Switch>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
