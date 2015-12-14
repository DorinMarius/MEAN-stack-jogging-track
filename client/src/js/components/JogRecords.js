import React from 'react';
import {
  Row,
  Col,
  PageHeader,
  Panel
} from 'react-bootstrap';

const RecordListCell = ({record}) => {
  const d = record.distance
  const distance = d >= 1000 ?
    (d / 1000).toFixed(2) + 'KM':
    d + 'M';

  const t = record.time
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

export default () => {

  const data = [
    {
      date: '2015-12-12',
      distance: 100,
      time: 40
    },
    {
      date: '2015-12-13',
      distance: 10000,
      time: 4000
    },
    {
      date: '2015-12-14',
      distance: 8200,
      time: 3500
    },
    {
      date: '2015-12-15',
      distance: 200,
      time: 300
    }
  ];

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
};
