import React, {Component} from 'react';
import {connect} from 'react-redux';
import {exposeSession} from './common';

import {
  Row,
  Col,
  Panel,
  Input,
  Button
} from 'react-bootstrap';

import {
  createUser,
  updateUser,
  deleteUser
} from '../actions';

const UserFields = ({
  username, email, password,
  onUsernameChange,
  onEmailChange,
  onPasswordChange
}) => {
  return (
    <div>
      <Col md={3}>
        <Input
          type="text"
          label="Username"
          value={username}
          onChange={onUsernameChange}
        />
      </Col>
      <Col md={3}>
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={onEmailChange}
        />
      </Col>
      <Col md={3}>
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={onPasswordChange}
        />
      </Col>
    </div>
  );
};

const onFieldChange = (fieldName, setState) => {
  return (e) => {
    const value = e.target.value;
    setState({[fieldName]: value});
  };
};

class _NewUserForm extends Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.initState);
  }

  initState = {
    username: "",
    email: "",
    password: ""
  }

  onFieldChange = (fieldName) => onFieldChange(fieldName, ::this.setState)

  createUser = () => {
    const {userId, token} = this.props.session;
    const {dispatch} = this.props;

    const {username, email, password} = this.state;

    dispatch(createUser({
      username,
      email,
      password,
      userId,
      token
    }));

    this.setState(Object.assign({}, this.initState));
  }

  render() {

    const btnStyle = {
      marginTop: '25px'
    };

    return (
      <Panel>
        <Row>
          <UserFields
            username={this.state.username}
            email={this.state.email}
            password={this.state.password}
            onUsernameChange={this.onFieldChange('username')}
            onEmailChange={this.onFieldChange('email')}
            onPasswordChange={this.onFieldChange('password')}
          />
          <Col md={3}>
            <Button
              bsStyle="primary"
              style={btnStyle}
              onClick={this.createUser}
            >Create</Button>
          </Col>
        </Row>
      </Panel>
    );
  }
}

export const NewUserForm = connect(exposeSession)(_NewUserForm);

class _EditUserForm extends Component {

  constructor(props) {
    super(props);

    const {username, email} = props.user;
    this.state = {
      username, email,
      password: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const {username, email} = nextProps.user;
    this.setState({
      username, email
    });
  }

  onFieldChange = (fieldName) => onFieldChange(fieldName, ::this.setState)

  updateUser = () => {
    const {userId, token} = this.props.session;
    const {dispatch} = this.props;

    const {username, email, password} = this.state;
    dispatch(updateUser({
      id: this.props.user.id,
      username,
      email,
      password,
      userId,
      token
    }));

    this.props.cancelEdit();
  }

  deleteUser = () => {
    const {userId, token} = this.props.session;
    const {id} = this.props.record;
    const {dispatch} = this.props;

    if (!confirm('Are you sure to delete this user?')) return;

    dispatch(deleteUser({
      id, userId, token
    }));
  }

  render() {
    const btnStyle = {
      marginTop: '25px'
    };

    return (
      <Panel>
        <Row>
          <UserFields
            usenae={this.state.usenae}
            emal={this.state.emal}
            onUsernameChange={this.onFieldChange('username')}
            onEmailChange={this.onFieldChange('email')}
            onPasswordChange={this.onFieldChange('password')}
          />
          <Col md={3}>
            <Button
              bsStyle="primary"
              style={btnStyle}
              onClick={this.updateUser}
            >
              Save
            </Button>
            &nbsp;
            <Button
              style={btnStyle}
              onClick={this.props.cancelEdit}
            >
              Cancel
            </Button>
            &nbsp;
            <Button
              bsStyle="danger"
              style={btnStyle}
              onClick={this.deleteUser}
            >
              Delete
            </Button>
          </Col>
        </Row>
      </Panel>
    );
  }
}

export const EditUserForm = connect(exposeSession)(_EditUserForm);
