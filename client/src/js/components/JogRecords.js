import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

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
    (d / 1000).toFixed(2) + ' KM':
    d + ' M';

  const t = record.time;
  const time = t >= 3600 ?
    Math.floor(t / 3600) + 'h' + Math.floor(t % 3600 / 60) + 'm' + Math.floor(t % 60) + 's':
    (t >= 60) ? Math.floor(t % 3600 / 60) + 'm' + Math.floor(t % 60) + 's' :
      t + 's';

  const speed = record.speed.toFixed(2);
  const pace = record.pace.toFixed(2);

  return (
    <Panel>
      <Row>
        <Col md={3}>Date: {record.date.format('YYYY/MM/DD')}</Col>
        <Col md={3}>
          <div>Distance: {distance}</div>
          <div>Average Pace: {pace} mins/KM</div>
        </Col>
        <Col md={3}>
          <div>Time: {time}</div>
          <div>Average Speed: {speed} M/s</div>
        </Col>
        <Col md={3}>Action Here</Col>
      </Row>
    </Panel>
  );
};

const WeeklyRecords = ({records}) => {
  const data = _(records).
    sortBy('date').
    reverse().
    value();

  const lastDate = data[0].date;

  const from = moment(lastDate).weekday(0).format('YYYY/MM/DD');
  const to = moment(lastDate).weekday(6).format('YYYY/MM/DD');

  const avePace = (_(data).pluck('pace').sum() / data.length).toFixed(2);
  const aveSpeed = (_(data).pluck('speed').sum() / data.length).toFixed(2);

  const style = {
    marginTop: '40px'
  };

  return (
    <div style={style}>
      <div className="pull-right">
        <span>Average Pace: {avePace} mins/KM</span>,&nbsp;
        <span>Average Speed: {aveSpeed} M/s</span>
      </div>
      <h3>{from}~{to}</h3>
      {data.map(r => <RecordListCell key={r.id} record={r} />)}
    </div>
  );
};

const JogRecords = connect(
  (state) => {
    return {jogRecords: state.jogRecords};
  }
)((props) => {

  // TODO test it
  const data = _(props.jogRecords).
    map(r => Object.assign({}, r, {
      date: moment(r.date),
      pace: (r.time / 60) / (r.distance / 1000) ,
      speed: r.distance / r.time
    })).
    groupBy(r => r.date.week()).
    map(list => ({
      week: list[0].date.format('YYYY-ww'),
      records: list
    })).
    sortBy('week').
    reverse().
    value();

  const list = data.
    map((recordsByWeek) => (
      <WeeklyRecords
        key={recordsByWeek.week}
        records={recordsByWeek.records}
      />
    ));

  return (
    <div>
      <PageHeader>
        Your Jogging Records
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
