import React from "react";
import ReactDom from "react-dom";

import {
  createStore,
  compose,
  combineReducers,
  applyMiddleware
} from 'redux';

import thunkMiddleware from 'redux-thunk';

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
import jogRecordsReducer from './reducers/jog-records';
import usersReducer from './reducers/users';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import JogRecords from './components/JogRecords';
import UserList from './components/UserList';

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
  router: routerStateReducer,
  session: sessionReducer,
  jogRecords: jogRecordsReducer,
  users: usersReducer
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
      <IndexRoute component={JogRecords} />

      <Route path="users/:userId/records" component={JogRecords} />
      <Route path="users" component={UserList} />

      <Route path="signup" component={Signup} />
      <Route path="login" component={Login} />

    </Route>
  </ReduxRouter>
);

const Root = () => (
  <Provider store={store}>
    {routes}
  </Provider>
);

store.subscribe(() => {
  const {session} = store.getState();
  localStorage.setItem('session', JSON.stringify(session));
});

ReactDom.render(
  <Root />,
  document.getElementById("root")
);
