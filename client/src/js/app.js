import React from "react";
import ReactDom from "react-dom";
import {Button} from 'react-bootstrap';

ReactDom.render(
  <Button bsStyle="primary">Primary</Button>,
  // <div>Hello React</div>,
  document.getElementById("container")
);
