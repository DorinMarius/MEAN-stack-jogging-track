import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Link} from 'react-router';
import {pushState} from 'redux-router';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

class MyNavbar extends Component {
  goto = (path) => () => {
    const {dispatch} = this.props;
    dispatch(pushState(null, path));
  }

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">JogTal</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem onClick={this.goto('signup')}>Sign Up</NavItem>
            <NavItem onClick={this.goto('login')}>Log In</NavItem>
            <NavItem>Log Out</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
};

export default connect()(MyNavbar);
