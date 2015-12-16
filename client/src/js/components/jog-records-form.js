import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {exposeSession} from './common';

import {
  Row,
  Col,
  Panel,
  Input,
  Button
} from 'react-bootstrap';

import {
  createJogRecord,
  updateJogRecord,
  deleteJogRecord
} from '../actions';

const JogFields = ({
  date, distance, time,
  onDateChange,
  onDistanceChange,
  onTimeChange
}) => {
  return (
    <div>
      <Col md={3}>
        <Input
          type="date"
          label="Date"
          value={date}
          onChange={onDateChange}
        />
      </Col>
      <Col md={3}>
        <Input
          type="number"
          label="Distance (in KM)"
          value={distance}
          onChange={onDistanceChange}
        />
      </Col>
      <Col md={3}>
        <Input
          type="number"
          label="Time (in seconds)"
          value={time}
          onChange={onTimeChange}
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

const checkDistanceAndTime = (distance, time) => {
  if (distance <= 0) {
    alert('distance must greater then 0');
    return false;
  }

  if (time <= 0) {
    alert('time must greater then 0');
    return false;
  }

  return true;
};

class _NewJogForm extends Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.initState);
  }

  // TODO default date is today
  initState = {
    date: moment(Date.now()).format('YYYY-MM-DD'),
    distance: 0,
    time: 0
  }

  onFieldChange = (fieldName) => onFieldChange(fieldName, ::this.setState)

  createJog = () => {
    const distance = parseFloat(this.state.distance) * 1000;
    const time = parseInt(this.state.time);

    if (!checkDistanceAndTime(distance, time)) return;

    const {userId, token} = this.props.session;
    const {dispatch} = this.props;

    dispatch(createJogRecord({
      date: this.state.date,
      distance,
      time,
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
          <JogFields
            date={this.state.date}
            distance={this.state.distance}
            time={this.state.time}
            onDateChange={this.onFieldChange('date')}
            onDistanceChange={this.onFieldChange('distance')}
            onTimeChange={this.onFieldChange('time')}
          />
          <Col md={3}>
            <Button
              bsStyle="primary"
              style={btnStyle}
              onClick={this.createJog}
            >Create</Button>
          </Col>
        </Row>
      </Panel>
    );
  }
}

export const NewJogForm = connect(exposeSession)(_NewJogForm);

class _EditJogForm extends Component {

  constructor(props) {
    super(props);

    const {date, distance, time} = props.record;
    this.state = {
      date: date.format('YYYY-MM-DD'),
      distance: distance / 1000,
      time
    };
  }

  componentWillReceiveProps(nextProps) {
    const {date, distance, time} = nextProps.record;
    this.setState({
      date: date.format('YYYY-MM-DD'),
      distance: distance / 1000,
      time
    });
  }

  onFieldChange = (fieldName) => onFieldChange(fieldName, ::this.setState)

  updateJog = () => {
    const distance = parseFloat(this.state.distance) * 1000;
    const time = parseInt(this.state.time);

    if (!checkDistanceAndTime(distance, time)) return;

    const {userId, token} = this.props.session;
    const {dispatch} = this.props;

    dispatch(updateJogRecord({
      id: this.props.record.id,
      date: this.state.date,
      distance,
      time,
      userId,
      token
    }));

    this.props.cancelEdit();
  }

  deleteJog = () => {
    const {userId, token} = this.props.session;
    const {id} = this.props.record;
    const {dispatch} = this.props;

    if (!confirm('Are you sure to delete this record?')) return;

    dispatch(deleteJogRecord({
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
          <JogFields
            date={this.state.date}
            distance={this.state.distance}
            time={this.state.time}
            onDateChange={this.onFieldChange('date')}
            onDistanceChange={this.onFieldChange('distance')}
            onTimeChange={this.onFieldChange('time')}
          />
          <Col md={3}>
            <Button
              bsStyle="primary"
              style={btnStyle}
              onClick={this.updateJog}
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
              onClick={this.deleteJog}
            >
              Delete
            </Button>
          </Col>
        </Row>
      </Panel>
    );
  }
}

export const EditJogForm = connect(exposeSession)(_EditJogForm);
