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

export class NewJogForm extends Component {

  constructor() {
    super();
    this.state = this.initState;
  }

  // TODO default date is today
  initState = {
    date: moment(Date.now()).format('YYYY-MM-DD'),
    distance: 0,
    time: 0
  }

  createJog = () => {
    const distance = parseFloat(this.state.distance) * 1000;
    const time = parseInt(this.state.time);

    if (distance <= 0) {
      alert('distance must greater then 0');
      return;
    }

    if (time <= 0) {
      alert('time must greater then 0');
      return;
    }

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

  onFieldChange = (fieldName) => {
    return (e) => {
      const value = e.target.value;
      this.setState({[fieldName]: value});
    }
  }

  render() {
    const wrapperStyle = {
      marginTop: '40px'
    };

    const btnStyle = {
      marginTop: '25px'
    };

    return (
      <div style={wrapperStyle}>
        <h3>Create New Records</h3>
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
      </div>
    );
  }
}
