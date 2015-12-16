import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

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
  fetchAllJogRecords
} from '../actions';

const RecordListCell = ({record, onEditBtnClick}) => {
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

class EditableRecordListCell extends Component {
  state = {
    editing: false
  }

  cancelEdit = () => {
    this.setState({editing: false});
  }

  onEditBtnClick = () => {
    this.setState({editing: true});
  }

  render() {
    if (this.state.editing) {
      return (
        <EditJogForm
          record={this.props.record}
          cancelEdit={this.cancelEdit}
        />
      );
    } else {
      return (
        <RecordListCell
          record={this.props.record}
          onEditBtnClick={this.onEditBtnClick}
        />
      );
    }
  }
}

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
      {filteredData.map(r => <EditableRecordListCell key={r.id} record={r} />)}
    </div>
  );
};

const JogRecords = connect(
  (state) => {
    return {jogRecords: state.jogRecords};
  }
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
        week: moment(date).weekday(0).format('YYYY-ww')
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

class JogRecordsListPage extends Component {

  componentDidMount() {
    const {userId, token} = this.props.session;
    const {dispatch} = this.props;
    dispatch(fetchAllJogRecords(userId, token));
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

    const newFormWrapperStyle = {
      marginTop: '40px'
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
        <PageHeader>
          Your Jogging Records
        </PageHeader>
        <div style={newFormWrapperStyle}>
          <h3>Create New Record</h3>
          <NewJogForm />
        </div>
        <JogRecords
          filterFrom={this.state.filterFrom}
          filterTo={this.state.filterTo}
        />
      </div>
    );
  }

};

const stateToProps = (state) => {
  return {
    session: state.session
  };
};

export default connect(stateToProps)(JogRecordsListPage);
