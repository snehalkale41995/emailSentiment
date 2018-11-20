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
    }, 500);
  }

  onEditFeedback(cell, row) {
    return (
      <FormGroup row>
        <Col>
          <Emoji
            emoji="blush"
            set="emojione"
            onClick={() => this.updateFeedback(row.Id, 1)}
            size={30}
          />
        </Col>
        <Col>
          <Emoji
            emoji="neutral_face"
            set="emojione"
            onClick={() => this.updateFeedback(row.Id, 2)}
            size={30}
          />
        </Col>
        <Col>
          <Emoji
            emoji="white_frowning_face"
            onClick={() => this.updateFeedback(row.Id, 0)}
            set="emojione"
            size={30}
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
    this.props.getVerifiedData();
  }

  render() {
    const options = {
      sizePerPageList: [
        {
          text: "50",
          value: 50
        },
        {
          text: "100",
          value: 100
        },
        {
          text: "200",
          value: 200
        },
        {
          text: "All",
          value: this.props.emailAnalysisData.length
        }
      ],
      sizePerPage: 50
    };
    return this.state.loading ? (
      <Loader loading={this.state.loading} />
    ) : (
      <div>
        <ToastContainer autoClose={2000} />
        <FormGroup row className="marginBottomZero">
          <Col xs="6" md="3" />
        </FormGroup>
        <br />
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <FormGroup row className="marginBottomZero">
                    <Col xs="12" md="11">
                      <h1 className="regHeading paddingTop8">Feedback</h1>
                    </Col>
                    <Button color="primary" onClick={() => this.exportToTsv()}>
                     Upload TSV
                    </Button>
                    <Col xs="10" md="1" />
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <BootstrapTable
                    ref="table"
                    data={this.props.emailAnalysisData}
                    pagination={true}
                    search={true}
                    options={options}
                    version="4"
                  >
                    <TableHeaderColumn
                      dataField="Id"
                      headerAlign="left"
                      isKey
                      hidden
                    >
                      Id
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="Subject"
                      headerAlign="left"
                      width="20"
                      dataSort={true}
                    >
                      Subject
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="Sender"
                      headerAlign="left"
                      width="20"
                      dataSort={true}
                    >
                      Sender
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="Sentiment"
                      headerAlign="left"
                      width="20"
                      dataSort={true}
                    >
                      Sentiment
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="edit"
                      headerAlign="left"
                      width="10"
                      dataFormat={this.onEditFeedback.bind(this)}
                    >
                      Feedback
                    </TableHeaderColumn>
                  </BootstrapTable>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    emailAnalysisData: state.dashboard.emailAnalysisData
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
