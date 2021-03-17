import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import TestPage from './pages/test';
import Start from './pages/start';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { persistor, store } from './state-store/store';

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
              <Start width={width} />
            </Route>
            <Route path={'/test'} >
              <TestPage />
            </Route>
          </Switch>
        </BrowserRouter >
      </PersistGate>
    </Provider>
  );
}

export default App;
