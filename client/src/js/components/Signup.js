import React, {Component} from 'react';
import {Input, Button} from 'react-bootstrap';
import {
  formStyle,
  headerStyle,
  topInputStyle,
  middleInputStyle,
  bottomInputStyle
} from '../styles/session-form';

export default class Signup extends Component {
  signup = () => {
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const passwordConfirm = this.refs.passwordConfirm.value;

    if (password !== passwordConfirm) {
      alert('Password not match');
      return;
    }
  }

  render() {
    return (
      <form style={formStyle}>
        <h2 style={headerStyle}>Sign Up</h2>
        <input
          className="form-control"
          style={topInputStyle}
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
