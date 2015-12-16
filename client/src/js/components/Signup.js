import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Input, Button} from 'react-bootstrap';
import {
  formStyle,
  headerStyle,
  topInputStyle,
  middleInputStyle,
  bottomInputStyle
} from '../styles/session-form';

import {signup} from '../actions';

class Signup extends Component {
  signup = () => {
    const username = this.refs.username.value;
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const passwordConfirm = this.refs.passwordConfirm.value;

    if (password !== passwordConfirm) {
      alert('Password not match');
      return;
    }

    const {dispatch} = this.props;
    dispatch(signup(username, email, password));
  }

  render() {
    return (
      <form style={formStyle}>
        <h2 style={headerStyle}>Sign Up</h2>
        <input
          className="form-control"
          style={topInputStyle}
          type="username"
          placeholder="Username"
          ref="username"
        />
        <input
          className="form-control"
          style={middleInputStyle}
          type="email"
          placeholder="Email"
          ref="email"
        />
        <input
          className="form-control"
          style={middleInputStyle}
          type="password"
          placeholder="Password"
          ref="password"
        />
        <input
          className="form-control"
          style={bottomInputStyle}
          type="password"
          placeholder="Password Comirmation"
          ref="passwordConfirm"
        />
        <Button
          bsStyle="primary"
          bsSize="large"
          block
          onClick={this.signup}
        >Sign Up</Button>
      </form>
    );
  }
};

export default connect()(Signup);
