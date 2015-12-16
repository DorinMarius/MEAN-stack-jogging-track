import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import {Editable, exposeSession} from './common';

import {
  Row,
  Col,
  PageHeader,
  Panel,
  Button
} from 'react-bootstrap';

import {
  NewJogForm,
  EditJogForm
} from './jog-records-form';

import {
  fetchAllJogRecords,
  fetchUser
} from '../actions';

const RecordListCell = ({data, onEditBtnClick}) => {
  const record = data;
  const d = record.distance;
  const distance = d >= 1000 ?
    (d / 1000).toFixed(2) + ' KM':
    d + ' M';

  const t = record.time;

  // TODO: refactor this
  const time = t >= 3600 ?
    Math.floor(t / 3600) + 'h' +
      Math.floor(t % 3600 / 60) + 'm' +
        Math.floor(t % 60) + 's':
    (t >= 60) ?
      Math.floor(t % 3600 / 60) + 'm' +
        Math.floor(t % 60) + 's' :
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
        <Col md={3}>
          <Button
            onClick={onEditBtnClick}
          >
            Edit
          </Button>
        </Col>
      </Row>
    </Panel>
  );
};

const EditableRecordListCell = ({record}) => (
  <Editable
    data={record}
    normal={RecordListCell}
    editing={EditJogForm}
  />
);

const WeeklyRecords = ({records, filterFrom, filterTo}) => {
  const filterFromM = filterFrom ? moment(filterFrom) : null;
  const filterToM = filterTo ? moment(filterTo).add(1, 'day') : null;

  const lastDate = records[0].date;

  const from = moment(lastDate).weekday(0).format('YYYY/MM/DD');
  const to = moment(lastDate).weekday(6).format('YYYY/MM/DD');

  const filteredData = _(records).
    filter(r => {
      if (filterFromM && r.date < filterFromM) return false;
      if (filterToM && r.date >= filterToM) return false;
      return true;
    }).
    sortBy('date').
    reverse().
    value();

  const avePace = (_(records).pluck('pace').sum() / records.length).toFixed(2);
  const aveSpeed = (_(records).pluck('speed').sum() / records.length).toFixed(2);
  const totalDistance = _(records).pluck('distance').sum() / records.length / 1000;
  const aveDistance = totalDistance / records.length;

  const style = {
    marginTop: '40px'
  };

  return (
    <div style={style}>
      <div className="pull-right">
        <span>Average Pace: {avePace} mins/KM</span>,&nbsp;
        <span>Average Speed: {aveSpeed} M/s</span>,&nbsp;
        <span>Total Distance: {totalDistance.toFixed(2)} KM</span>,&nbsp;
        <span>Average Distance: {aveDistance.toFixed(2)} KM</span>,&nbsp;
      </div>
      <h3>{from}~{to}</h3>
      {filteredData.map(r => <EditableRecordListCell key={r.id} record={r} />)}
    </div>
  );
};

const JogRecords = connect(
  (state) => ({jogRecords: state.jogRecords})
)(({jogRecords, filterFrom, filterTo}) => {
  const fromWeek = filterFrom ?
    moment(filterFrom).weekday(0).format('YYYY-ww') : null;
  const toWeek = filterTo ?
    moment(filterTo).weekday(0).format('YYYY-ww') : null;

  // TODO test it
  const data = _(jogRecords).
    map(r => {
      const date = moment(r.date);
      return Object.assign({}, r, {
        date,
        pace: (r.time / 60) / (r.distance / 1000) ,
        speed: r.distance / r.time,
        week: moment(date).weekday(6).format('YYYY-ww')
      });
    }).
    filter(r => {
      if (fromWeek && r.week < fromWeek) return false;
      if (toWeek && r.week > toWeek) return false;
      return true;
    }).
    groupBy('week').
    map(list => {
      return {
        week: list[0].week,
        records: list
      };
    }).
    sortBy('week').
    reverse().
    value();

  const list = data.
    map((recordsByWeek) => (
      <WeeklyRecords
        key={recordsByWeek.week}
        records={recordsByWeek.records}
        filterFrom={filterFrom}
        filterTo={filterTo}
      />
    ));

  return (
    <div>
      {list}
    </div>
  );
});

const JogRecordsPageHeader = connect(
  (state) => ({
    session: state.session,
    users: state.users
  })
)(({users, session, userId}) => {

  const currentUserId = session.userId;
  const _userId = userId || currentUserId;

  const isCurrentUser = _userId === currentUserId;
  const user = users.filter((user) => user.id === _userId)[0];

  if (!user) {
    return <div>Loading...</div>;
  }

  const newFormWrapperStyle = {
    marginTop: '40px'
  };

  return (
    <div>
      <PageHeader>
        {
          (isCurrentUser) ? 'Your' : user.username + "'s"
        }
        &nbsp;Jogging Records
      </PageHeader>
      <div style={newFormWrapperStyle}>
        <h3>Create New Record</h3>
        <NewJogForm userId={user.id} />
      </div>
    </div>
  );
});

class JogRecordsListPage extends Component {

  componentDidMount() {
    const {token} = this.props.session;
    const currentUserId = this.props.session.userId;
    const userId = this.props.params.userId || currentUserId;
    const {dispatch} = this.props;
    if (token) {
      dispatch(fetchUser(userId, token));
      dispatch(fetchAllJogRecords(userId, token));
    }
  }

  componentWillReceiveProps(nextProps) {
    const {token} = nextProps.session;
    const currentUserId = nextProps.session.userId;
    const userId = nextProps.params.userId || currentUserId;
    const {dispatch} = nextProps;
    if (token) {
      dispatch(fetchUser(userId, token));
      dispatch(fetchAllJogRecords(userId, token));
    }
  }

  state = {}

  filterFromChanged = () => {
    this.setState({
      filterFrom: this.refs.filterFrom.value
    });
  }

  filterToChanged = () => {
    this.setState({
      filterTo: this.refs.filterTo.value
    });
  }

  render() {
    const filterWrapperStyle = {
      top: '12px',
      position: 'relative'
    };

    return (
      <div>
        <div className="pull-right" style={filterWrapperStyle}>
          <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
            Filter:&nbsp;
            <input
              className="form-control"
              type="date"
              ref="filterFrom"
              onChange={this.filterFromChanged}
            />
            &nbsp;~&nbsp;
            <input
              className="form-control"
              type="date"
              ref="filterTo"
              onChange={this.filterToChanged}
            />
          </form>
        </div>
        <JogRecordsPageHeader userId={this.props.params.userId} />
        <JogRecords
          filterFrom={this.state.filterFrom}
          filterTo={this.state.filterTo}
        />
      </div>
    );
  }

};

export default connect(exposeSession)(JogRecordsListPage);
