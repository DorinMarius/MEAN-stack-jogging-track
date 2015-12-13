import React from "react";
import ReactDom from "react-dom";

import {createStore, compose, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import {Route, Link} from 'react-router';
import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter
} from 'redux-router';
import {createHistory} from 'history';

import {Button} from 'react-bootstrap';

// TODO
const A = () => (
  <div>
    A
  </div>
);
const B = () => <div>B</div>;

const App = ({
  children
}) => (
  <div>
    App
    <Link to="a">A</Link>
    <Link to="b">B</Link>
    {children}
  </div>
);

const reducer = combineReducers({
  router: routerStateReducer
});

const store = compose(
  reduxReactRouter({createHistory})
)(createStore)(reducer);

const Root = () => (
  <div>
    <Provider store={store}>
      <ReduxRouter>
        <Route path="/" component={App}>
          <Route path="a" component={A} />
          <Route path="b" component={B} />
        </Route>
      </ReduxRouter>
    </Provider>
  </div>
)

ReactDom.render(
  <Root />,
  document.getElementById("root")
);
