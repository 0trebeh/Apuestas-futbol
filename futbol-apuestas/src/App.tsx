import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {persistor, store} from './state-store/store';
import axios from 'axios';

import Home from './pages/home';
import Profile from './pages/profile';
import Matches from './pages/matches';
import Stats from './pages/stats';
import Notifications from './pages/notifications';
import Predictions from './pages/predictions';

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
            <Route exact path={'/matches'}>
              <Matches />
            </Route>
            <Route exact path={'/estadisticas'}>
              <Stats />
            </Route>
            <Route exact path={'/predicciones'}>
              <Predictions />
            </Route>
            <Route exact path={'/notifications'}>
              <Notifications />
            </Route>
          </Switch>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
