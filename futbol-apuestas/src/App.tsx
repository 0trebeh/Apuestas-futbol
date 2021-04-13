import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {persistor, store} from './state-store/store';
import axios from 'axios';

import Home from './pages/home';
import Profile from './pages/profile';
import Apuestas from './pages/apuestas';
import Estadisticas from './pages/estisticas';
import Predicciones from './pages/predicciones';
import Partidos from './pages/partidos';

axios.defaults.baseURL = 'https://fap-api.herokuapp.com';

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
              <Apuestas />
            </Route>
            <Route exact path={'/estadisticas'}>
              <Estadisticas />
            </Route>
            <Route exact path={'/predicciones'}>
              <Predicciones />
            </Route>
            <Route exact path={'/partidos'}>
              <Partidos />
            </Route>
          </Switch>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
