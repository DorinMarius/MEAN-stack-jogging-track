import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Link} from 'react-router';
import {pushState} from 'redux-router';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

import {logout} from '../actions';

class MyNavbar extends Component {
  checkSession = (props = this.props) => {
    const {isLoggedIn, isInSessionPath, dispatch} = props;

    if (isLoggedIn) {
      if (isInSessionPath) {
        dispatch(pushState(null, '/'));
      }
    } else {
      if (!isInSessionPath) {
        dispatch(pushState(null, '/login'));
      }
    }
  }

  componentDidMount = () => {
    this.checkSession();
  }

  componentWillReceiveProps = (nextProps) => {
    this.checkSession(nextProps);
  }

  goto = (path) => () => {
    const {dispatch} = this.props;
    dispatch(pushState(null, path));
  }

  logout = () => {
    const {dispatch} = this.props;
    dispatch(logout());
  }

  render() {
    const sessionNav = this.props.isLoggedIn ? (
      <Nav pullRight>
        <NavItem onClick={this.logout}>Log Out</NavItem>
      </Nav>
    ) : (
      <Nav pullRight>
        <NavItem onClick={this.goto('/signup')}>Sign Up</NavItem>
        <NavItem onClick={this.goto('/login')}>Log In</NavItem>
      </Nav>
    );

    const {Header, Brand, Toggle, Collapse} = Navbar;

    const managerNav = this.props.canManageUsers ? (
      <Nav>
        <NavItem onClick={this.goto('/users')}>Users</NavItem>
      </Nav>
    ) : (
      <Nav></Nav>
    );

    return (
      <Navbar>
        <Header>
          <Brand>
            <Link to="/">JogTal</Link>
          </Brand>
          <Toggle />
        </Header>
        <Collapse>
          {managerNav}
          {sessionNav}
        </Collapse>
      </Navbar>
    );
  }
};

const stateToProps = (state) => {
  const roles = state.session.roles;
  const isLoggedIn = state.session.userId !== undefined;
  const canManageUsers = _.include(roles, 'admin') || _.include(roles, 'manager');
  const currentPath = state.router.location.pathname;
  const isInSessionPath = currentPath === '/login' || currentPath === '/signup';

  return {
    isLoggedIn,
    isInSessionPath,
    canManageUsers
  };
};

export default connect(stateToProps)(MyNavbar);
