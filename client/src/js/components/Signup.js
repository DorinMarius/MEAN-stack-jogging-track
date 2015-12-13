import React, {Component} from 'react';
import {Input, Button} from 'react-bootstrap';

const formStyle = {
  maxWidth: '330px',
  margin: '0 auto'
};

const headerStyle = {
  margin: '10px 0 15px 0'
};

const inputStyle = {
  height: 'auto',
  padding: '10px',
  fontSize: '16px'
};

const topInputStyle = Object.assign({
  marginBottom: '-1px',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}, inputStyle);

const middleInputStyle = Object.assign({
  marginBottom: '-1px',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}, inputStyle);

const bottomInputStyle = Object.assign({
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  marginBottom: '15px'
}, inputStyle);

export default class Signup extends Component {
  signup = () => {
    const email = this.refs.email.value;
    console.log(email);
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
