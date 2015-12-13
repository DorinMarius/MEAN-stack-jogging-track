import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Link} from 'react-router';
import {pushState} from 'redux-router';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

import {logout} from '../actions';

class MyNavbar extends Component {
  shouldComponentUpdate = ({isLoggedIn, isInSessionPath, dispatch}) => {
    if (isLoggedIn) {
      if (isInSessionPath) {
        dispatch(pushState(null, '/'));
        return false;
      }
    } else {
      if (!isInSessionPath) {
        dispatch(pushState(null, '/login'));
        return false;
      }
    }

    return true;
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

    const {Header, Brand, Toggle, Collapse} = Navbar

    return (
      <Navbar>
        <Header>
          <Brand>
            <Link to="/">JogTal</Link>
          </Brand>
          <Toggle />
        </Header>
        <Collapse>
          {sessionNav}
        </Collapse>
      </Navbar>
    );
  }
};

const stateToProps = (state) => {
  const isLoggedIn = state.session.userId !== undefined
  const currentPath = state.router.location.pathname;
  const isInSessionPath = currentPath === '/login' || currentPath === '/signup';

  return {
    isLoggedIn,
    isInSessionPath
  };
};

export default connect(stateToProps)(MyNavbar);
