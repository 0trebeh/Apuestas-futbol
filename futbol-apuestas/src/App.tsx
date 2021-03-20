import React, { useState } from 'react';
import './App.css';
import Home from './pages/home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { persistor, store } from './state-store/store';

import axios from 'axios';

axios.defaults.baseURL = 'https://fap-api.herokuapp.com';

function App() {
  
  const [width, setWidth] = useState(window.innerWidth);

  window.addEventListener('resize', (e) => {
    setWidth(window.innerWidth);
  })

  return (
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        <BrowserRouter>
          <Switch>
            <Route exact path={'/'} >
              <Home width={width} />
            </Route>
          </Switch>
        </BrowserRouter >
      </PersistGate>
    </Provider>
  );
}

export default App;
