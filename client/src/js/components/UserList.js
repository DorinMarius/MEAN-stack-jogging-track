import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
 fetchAllUsers
} from '../actions';

import {
  Row,
  Col,
  PageHeader,
  Panel,
  Button
} from 'react-bootstrap';

export default class UserListPage extends Component {

  componentDidMount() {
    const {userId, token} = this.props.session;
    const {dispatch} = this.props;
    dispatch(fetchAllUsers(token));
  }

  render() {

    return (
      <div>
        <PageHeader>
          User List
        </PageHeader>
      </div>
    );

  }

}

// TODO: reduce duplicate code
const stateToProps = (state) => {
  return {
    session: state.session
  };
};

export default connect(stateToProps)(UserListPage);
