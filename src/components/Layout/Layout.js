import React, { Component } from "react";
import { Container } from "reactstrap";
import Header from "../Header/";
import Footer from "../Footer/";

class Layout extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          {/* <main className="main"> */}
          <main>
            <Container fluid>{this.props.children}</Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}
export default Layout;
