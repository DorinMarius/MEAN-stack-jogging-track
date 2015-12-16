import React, {Component} from 'react';

export const exposeSession = (state) => {
  return {
    session: state.session
  };
};

export class Editable extends Component {
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
      const Editing = this.props.editing;
      return (
        <Editing
          data={this.props.data}
          cancelEdit={this.cancelEdit}
        />
      );
    } else {
      const Normal = this.props.normal;
      return (
        <Normal
          data={this.props.data}
          onEditBtnClick={this.onEditBtnClick}
        />
      );
    }
  }
}
