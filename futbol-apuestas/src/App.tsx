import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {persistor, store} from './state-store/store';
import axios from 'axios';

import Home from './pages/home';
import Profile from './pages/profile';
import Stats from './pages/stats';
import Predictions from './pages/predictions';
import Match from './pages/match';
import Bets from './pages/bets';

axios.defaults.baseURL = 'http://localhost:8000';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Switch>
            <Route exact path={'/'}>
              <Home />
            </Route>
            <Route exact path={'/profile'}>
              <Profile />
            </Route>
            <Route exact path={'/apuestas'}>
              <Bets />
            </Route>
            <Route exact path={'/estadisticas'}>
              <Stats />
            </Route>
            <Route exact path={'/predicciones'}>
              <Predictions />
            </Route>
            <Route exact path={'/partidos'}>
              <Match />
            </Route>
          </Switch>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
