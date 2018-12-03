import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as actions from "../../store/actions/index";
import {
  FormGroup,
  Col,
  Button,
  Card,
  CardHeader,
  Row,
  CardBody
} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import Modal from "../../components/Modal/ModalCart";
import { Emoji } from "emoji-mart";
import * as Toaster from "../../components/Modal/Toaster";
import moment from "moment";
import "./Dashboard.css";
const happyFace = require("../../../public/img/happy.png");
const neutralFace = require("../../../public/img/neutral.png");
const sadFace = require("../../../public/img/sad.png");
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailData: "",
      loading: true,
      roomId: ""
    };
  }

  componentDidMount() {
    this.props.getEmailData();
    let compRef = this;
    setTimeout(function() {
      compRef.setState({ loading: false });
    }, 3000);
  }

  onEditFeedback(cell, row) {
    return (
      <FormGroup row>
        <Col>
          <Emoji
            emoji="blush"
            set="emojione"
            onClick={() => this.updateFeedback(row.Id, 1)}
            size={40}
          />
        </Col>
        <Col>
          <Emoji
            emoji="neutral_face"
            set="emojione"
            onClick={() => this.updateFeedback(row.Id, 2)}
            size={40}
          />
        </Col>
        <Col>
          <Emoji
            emoji="white_frowning_face"
            onClick={() => this.updateFeedback(row.Id, 0)}
            set="emojione"
            size={40}
          />
        </Col>
      </FormGroup>
    );
  }

  updateFeedback(emailId, VerifiedField) {
    setTimeout(function() {
      compRef.setState({ loading: true });
    }, 100);
    let compRef = this;
    let emailData = {
      Id: emailId,
      Verified: VerifiedField
    };
    this.props.updateEmailData(emailData);
    setTimeout(function() {
      compRef.setState({ loading: false });
    }, 500);
  }

  exportToTsv() {
    let compRef = this;
    this.props.getVerifiedData();
    this.setState({ loading: true });
    setTimeout(() => {
      let message = "";
      compRef.props.emailDataError
        ? (message = "Something Went Wrong")
        : (message = `TSV File Uploaded Successfully`);
      compRef.setState({ loading: false });
      Toaster.Toaster(message, compRef.props.emailDataError);
    }, 1000);
  }

  getSentimentPrediction(Sentiment) {
    if (Sentiment == "Positive") {
      return <img src={happyFace} title="Happy" />;
    } else if (Sentiment == "Negative") {
      return <img src={sadFace} title="Sad" />;
    } else return <img src={neutralFace} title="Neutral" />;
  }

  selectSentiment(sentiment) {
    return (
      <div className="ChevronFlyout">
        <div className="FlyoutHeader">
          <div className="header-title">Change sentiment value...</div>
          <span>
            <div className="label-content">
              <ul
                role="listbox"
                aria-orientation="vertical"
                className="no_bullet"
                aria-label="Change sentiment value..."
              >
                <li>
                  <span
                    className="label name"
                    onClick={() => {
                      console.log("heyy");
                    }}
                  >
                    {" "}
                    <img src={happyFace} title="Happy" /> Confirm positive
                  </span>
                </li>
                <li>
                  <span className="label name">
                    {" "}
                    <img src={neutralFace} title="Neutral" /> Confirm Neutral
                  </span>
                </li>
                <li>
                  <span className="label name">
                    {" "}
                    <img src={sadFace} title="Sad" /> Confirm Negative
                  </span>
                </li>
              </ul>
            </div>
          </span>
          <div className="FlyoutFooter FlyoutFooter-Default">
            <Button color="secondary">Cancel</Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    var ColorCode = "#F4F2F2";
    if (this.state.loading || this.props.emailAnalysisData.length === 0) {
      return <Loader loading={this.state.loading} />;
    } else {
      return (
        <div>
          <ToastContainer autoClose={2000} />
          <FormGroup row className="marginBottomZero">
            <Col xs="6" md="3" />
          </FormGroup>
          <br />
          <div className="animated fadeIn">
            <Row>
              <Col xs="12" md="5">
                <iframe
                  width="750"
                  height="600"
                  src="https://app.powerbi.com/view?r=eyJrIjoiYmQ1OGJlYTAtYTJiNi00ZjliLWIxYjktN2JlYzNiY2ZlNDAwIiwidCI6IjYzNmYwYmJjLTdmYjgtNDJhNS1iYjNhLWQwYjA5YjhiZTJiNyIsImMiOjZ9"
                  frameborder="0"
                />
              </Col>
              <Col sm={{ size: "auto", offset: 1 }} xs="12" md="6">
                <Card>
                  <CardHeader>
                    <FormGroup row className="marginBottomZero">
                      <Col xs="12" md="12">
                        <h1 className="regHeading paddingTop8">Feedback</h1>
                      </Col>
                      {/* <Button color="primary" onClick={() => this.exportToTsv()}>
                      Upload TSV
                    </Button>
                    <Col xs="10" md="1" /> */}
                    </FormGroup>
                  </CardHeader>
                  <CardBody>
                    {this.props.emailAnalysisData.map((emailData, index) => {
                      return (
                        <Row key={index} className="justify-content-left">
                          <Col xs="12">
                            <Card
                              className="mx-12"
                              style={{ backgroundColor: ColorCode }}
                            >
                              <CardHeader>
                                <Row>
                                  <Col xs="12" md="4">
                                    <i className="icon-user" /> {""}{" "}
                                    {emailData.Sender}
                                  </Col>
                                  <Col sm={{ size: "auto", offset: 5 }} md="2">
                                    <i className="fa fa-clock-o" /> {""}{" "}
                                    {moment(emailData.createdAt).format(
                                      "DD.MM.YYYY"
                                    )}
                                  </Col>
                                  <Col xs="12" md="1">
                                    {this.getSentimentPrediction(
                                      emailData.Sentiment
                                    )}
                                  </Col>
                                </Row>
                              </CardHeader>
                              <CardBody
                                style={{ fontWeight: "bold", fontSize: 20 }}
                                className="p-8"
                              >
                                <Row>
                                  <Col xs="12">
                                    <h5> {emailData.Subject} </h5>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs="12" md="6">
                                    <h5>
                                      {/* <i className="fa fa-map-marker" />{" "} */}
                                      {emailData.Intent}
                                    </h5>
                                  </Col>
                                </Row>
                                <Row>
                                  {this.selectSentiment(emailData.Sentiment)}
                                </Row>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      );
                    })}
                    <ToastContainer autoClose={1000} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      );
    }
  }
}
const mapStateToProps = state => {
  return {
    emailAnalysisData: state.dashboard.emailAnalysisData,
    emailDataError: state.dashboard.emailDataError
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getEmailData: () => dispatch(actions.getEmailData()),
    updateEmailData: emailData => dispatch(actions.updateEmailData(emailData)),
    getVerifiedData: () => dispatch(actions.getVerifiedData())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
