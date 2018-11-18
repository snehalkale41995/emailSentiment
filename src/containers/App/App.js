import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Dashboard from "../../views/Dashboard/";
import Layout from "../../components/Layout/";
import { connect } from "react-redux";

let routes;
class App extends Component {
  render() {
      routes = (
        <Layout {...this.props}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Redirect from="/" to="/dashboard" />
            <Redirect to="/" />
          </Switch>
        </Layout>
      );
    return <div>{routes}</div>;
  }
}

export default App;
