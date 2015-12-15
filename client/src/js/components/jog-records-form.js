import React, {Component} from 'react';
import moment from 'moment';

import {
  Row,
  Col,
  Panel,
  Input,
  Button
} from 'react-bootstrap';

import {
  createJogRecord,
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
  )
};

const onFieldChange = (fieldName, setState) => {
  return (e) => {
    const value = e.target.value;
    setState({[fieldName]: value});
  }
}

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

export class NewJogForm extends Component {

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

    this.setState(this.initState);

    dispatch(createJogRecord({
      date: this.state.date,
      distance,
      time,
      userId,
      token
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
              onClick={this.createJog}
            >Create</Button>
          </Col>
        </Row>
      </Panel>
    );
  }
}

export class EditJogForm extends Component {

  constructor(props) {
    super(props);

    const {date, distance, time} = props.record;
    this.state = {
      date:date.format('YYYY-MM-DD'),
      distance, time
    };
  }

  componentWillReceiveProps(nextProps) {
    const {date, distance, time} = nextProps.record;
    this.setState({date, distance, time});
  }

  onFieldChange = (fieldName) => onFieldChange(fieldName, ::this.setState)

  updateJog = () => {
    const distance = parseFloat(this.state.distance) * 1000;
    const time = parseInt(this.state.time);

    if (!checkDistanceAndTime(distance, time)) return;

    const {userId, token} = this.props.session;
    const {dispatch} = this.props;

    // dispatch(updateJogRecord({
    //   date: this.state.date,
    //   distance,
    //   time,
    //   userId,
    //   token
    // }));
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
            >Save</Button>
          </Col>
        </Row>
      </Panel>
    );
  }
}
