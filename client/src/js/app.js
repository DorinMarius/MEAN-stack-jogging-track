import React from "react";
import ReactDom from "react-dom";

import {
  createStore,
  compose,
  combineReducers,
  applyMiddleware
} from 'redux';

import thunkMiddleware from 'redux-thunk'

import {Provider} from 'react-redux';

import {Route, IndexRoute, Link} from 'react-router';
import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter
} from 'redux-router';
import {createHistory} from 'history';

import {Grid} from 'react-bootstrap';

import sessionReducer from './reducers/session';

import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Signup from './components/Signup';

const App = ({
  children
}) => (
  <div>
    <Navbar />
    <Grid>
      {children}
    </Grid>
  </div>
);

const reducer = combineReducers({
  session: sessionReducer,
  router: routerStateReducer
});

const store = compose(
  applyMiddleware(
    thunkMiddleware
  ),
  reduxReactRouter({createHistory})
)(createStore)(reducer);

const routes = (
  <ReduxRouter>
    <Route path="/" component={App}>
      <IndexRoute component={Welcome} />

      <Route path="signup" component={Signup} />
      <Route path="login" component={Login} />

    </Route>
  </ReduxRouter>
);

const Root = () => (
  <Provider store={store}>
    {routes}
  </Provider>
)

ReactDom.render(
  <Root />,
  document.getElementById("root")
);
