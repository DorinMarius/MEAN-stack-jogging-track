import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
  Row,
  Col,
  PageHeader,
  Panel
} from 'react-bootstrap';

import {fetchAllJobRecords} from '../actions';

const RecordListCell = ({record}) => {
  const d = record.distance;
  const distance = d >= 1000 ?
    (d / 1000).toFixed(2) + 'KM':
    d + 'M';

  const t = record.time;
  const time = t >= 3600 ?
    Math.floor(t / 3600) + 'h' + Math.floor(t % 3600 / 60) + 'm' + Math.floor(t % 60) + 's':
    (t >= 60) ? Math.floor(t % 3600 / 60) + 'm' + Math.floor(t % 60) + 's' :
      t + 's';

  return (
    <Panel>
      <Row>
        <Col md={3}>Date: {record.date}</Col>
        <Col md={3}>Distance: {distance}</Col>
        <Col md={3}>Time: {time}</Col>
        <Col md={3}>Action Here</Col>
      </Row>
    </Panel>
  );
};

const JogRecords = connect(
  (state) => {
    return {jogRecords: state.jogRecords};
  }
)((props) => {
  const data = props.jogRecords;

  const list = data.
    map((r, i) => <RecordListCell key={i} record={r} />);

  return (
    <div>
      <PageHeader>
        Your Jog Records
      </PageHeader>
      {list}
    </div>
  );
});

class JogRecordsListPage extends Component {

  componentDidMount() {
    const {userId, token} = this.props.session;
    const {dispatch} = this.props;
    dispatch(fetchAllJobRecords(userId, token));
  }

  render() {
    return <JogRecords />;
  }

};

const stateToProps = (state) => {
  return {
    session: state.session
  };
};

export default connect(stateToProps)(JogRecordsListPage);
