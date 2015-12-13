import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Input, Button} from 'react-bootstrap';
import {
  formStyle,
  headerStyle,
  topInputStyle,
  bottomInputStyle
} from '../styles/session-form';

import {login} from '../actions';

class Login extends Component {
  login = () => {
    const {dispatch} = this.props;

    const email = this.refs.email.value;
    const password = this.refs.password.value;

    dispatch(login(email, password));
  }

  render() {
    return (
      <form style={formStyle}>
        <h2 style={headerStyle}>Login</h2>
        <input
          className="form-control"
          style={topInputStyle}
          type="email"
          placeholder="Email"
          ref="email"
        />
        <input
          className="form-control"
          style={bottomInputStyle}
          type="password"
          placeholder="Password Comirmation"
          ref="password"
        />
        <Button
          bsStyle="primary"
          bsSize="large"
          block
          onClick={this.login}
        >Login</Button>
      </form>
    );
  }
};

export default connect()(Login)
