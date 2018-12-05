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
  CardBody,
  Input
} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import { Emoji } from "emoji-mart";
import * as Toaster from "../../components/Modal/Toaster";
import moment from "moment";
import "./Dashboard.css";
import SearchInput, { createFilter } from "react-search-input";
const happyFace = require("../../../public/img/happy.png");
const neutralFace = require("../../../public/img/neutral.png");
const sadFace = require("../../../public/img/sad.png");
const KEYS_TO_FILTERS = ["Sender", "Subject", "Sentiment", "createdAt"];
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailData: "",
      loading: true,
      roomId: "",
      userFeedbackFlag: true,
      selectedSentimentId: "",
      searchTerm: ""
    };
  }

  componentDidMount() {
    this.props.getEmailData();
    let compRef = this;
    setTimeout(function() {
      compRef.setState({ loading: false });
    }, 2000);
  }

  updateFeedback(emailId, VerifiedField) {
    let emailData = {
      Id: emailId,
      Verified: VerifiedField
    };
    this.props.updateEmailData(emailData);
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

  getSentimentPrediction(Id, Sentiment) {
    if (Sentiment == "Positive") {
      return (
        <img
          src={happyFace}
          title="Happy"
          onClick={() => {
            this.setSentimentId(Id);
          }}
        />
      );
    } else if (Sentiment == "Negative") {
      return (
        <img
          src={sadFace}
          title="Sad"
          onClick={() => {
            this.setSentimentId(Id);
          }}
        />
      );
    } else {
      return (
        <img
          src={neutralFace}
          title="Neutral"
          onClick={() => {
            this.setSentimentId(Id);
          }}
        />
      );
    }
  }

  setSentimentId(sentimentId) {
    this.setState({ selectedSentimentId: sentimentId });
  }

  selectSentiment(Id, sentiment) {
    if (Id == this.state.selectedSentimentId) {
      return (
        <div
          className="ChevronFlyout"
          show={Id == this.state.selectedSentimentId}
        >
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
                      onClick={() => this.updateFeedback(Id, 1)}
                    >
                      <img src={happyFace} title="Happy" />{" "}
                      {sentiment == "Positive" ? "Confirm " : "Change To "}
                      Positive
                    </span>
                  </li>
                  <li>
                    <span
                      className="label name"
                      onClick={() => this.updateFeedback(Id, 2)}
                    >
                      <img src={neutralFace} title="Neutral" />{" "}
                      {sentiment == "Neutral" ? "Confirm " : "Change To "}{" "}
                      Neutral
                    </span>
                  </li>
                  <li>
                    <span
                      className="label name"
                      onClick={() => this.updateFeedback(Id, 0)}
                    >
                      <img src={sadFace} title="Sad" />{" "}
                      {sentiment == "Negative" ? "Confirm " : "Change To "}
                      Negative
                    </span>
                  </li>
                </ul>
              </div>
            </span>
            <div className="FlyoutFooter FlyoutFooter-Default">
              <Button
                color="secondary"
                onClick={() => {
                  this.setState({ selectedSentimentId: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      );
    } else return null;
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term });
  }

  render() {
    var ColorCode = "#F4F2F2";
    if (this.state.loading || this.props.emailAnalysisData.length === 0) {
      return <Loader loading={this.state.loading} />;
    } else {
      const filteredEmails = this.props.emailAnalysisData.filter(
        createFilter(this.state.searchTerm, KEYS_TO_FILTERS)
      );
      return (
        <div>
          <ToastContainer autoClose={2000} />
          <FormGroup row className="marginBottomZero">
            <Col xs="6" md="3" />
          </FormGroup>
          <br />
          <div className="animated fadeIn">
            <Row>
              <Col xs="12" md="8">
                <iframe
                  width="100%"
                  height="600"
                  src="https://app.powerbi.com/view?r=eyJrIjoiN2FjZDc1NjktZTVjNS00MDVhLWFmZTQtYTI1Yjg3NGMxMjNhIiwidCI6IjYzNmYwYmJjLTdmYjgtNDJhNS1iYjNhLWQwYjA5YjhiZTJiNyIsImMiOjZ9"
                  frameborder="0"
                />
              </Col>
              <Col xs="12" md="4">
                <Card className="cardContainer">
                  <CardHeader>
                    <FormGroup row className="marginBottomZero">
                      <Col xs="12" md="8">
                        <h1 className="regHeading paddingTop8">Feedback</h1>
                      </Col>
                      {/* <Button color="primary" onClick={() => this.exportToTsv()}>
                      Upload TSV
                    </Button>
                    <Col xs="10" md="1" /> */}
                      <Col xs="12" md="4">
                        <SearchInput
                          className="search-input"
                          onChange={this.searchUpdated.bind(this)}
                        />
                      </Col>
                    </FormGroup>
                  </CardHeader>
                  <CardBody>
                    {filteredEmails.map((emailData, index) => {
                      return (
                        <Row key={index} className="justify-content-left">
                          <Col xs="12">
                            <Card style={{ backgroundColor: ColorCode }}>
                              <CardHeader>
                                <Row>
                                  <Col xs="12" sm="1">
                                    <i className="icon-user" />
                                  </Col>
                                  <Col xs="12" sm="5">
                                    {emailData.Sender}
                                  </Col>
                                </Row>
                                {/* <Row>
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
                                      emailData.Id,
                                      emailData.Sentiment
                                    )}
                                  </Col>
                                </Row> */}
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
                                  <Col xs="12" md="12">
                                    <h6>{emailData.EmailBody}</h6>
                                  </Col>
                                </Row>
                                <Row>
                                  {this.selectSentiment(
                                    emailData.Id,
                                    emailData.Sentiment
                                  )}
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
