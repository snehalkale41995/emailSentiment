import RoomsList from "./RoomsList.js";
import React, { Component } from "react";
import { Route } from "react-router-dom";
class RoomsModule extends Component {
  render() {
    return (
      <div>
        <Route exact path={this.props.match.path} component={RoomsList} />
      </div>
    );
  }
}
export default RoomsModule;
