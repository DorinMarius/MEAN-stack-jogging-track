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

export class JogForm extends Component {

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
    return () => {
      const field = this.refs[fieldName]
      const value = field.getValue();
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
            <Col md={3}>
              <Input
                type="date"
                label="Date"
                value={this.state.date}
                onChange={this.onFieldChange('date')}
                ref="date"
              />
            </Col>
            <Col md={3}>
              <Input
                type="number"
                label="Distance (in KM)"
                value={this.state.distance}
                onChange={this.onFieldChange('distance')}
                ref="distance"
              />
            </Col>
            <Col md={3}>
              <Input
                type="number"
                label="Time (in seconds)"
                value={this.state.time}
                onChange={this.onFieldChange('time')}
                ref="time"
              />
            </Col>
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
