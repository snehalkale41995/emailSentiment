import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../components/Modal/ModalCart";
import Loader from "../../components/Loader/Loader";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteFlag: false,
      eventId: "",
      loading: true
    };
  }

  componentDidMount() {
    let compRef = this;
    this.props.getEmailData();
    setTimeout(function() {
      compRef.setState({ loading: false });
    }, 300);
  }

  // Toaster(compRef, successFlag, actionName) {
  //   this.setState({ loading: false });
  //   if (successFlag) {
  //     toast.success("Event " + actionName + " Successfully.", {
  //       position: toast.POSITION.BOTTOM_RIGHT
  //     });
  //   } else {
  //     toast.error("Something went wrong", {
  //       position: toast.POSITION.BOTTOM_RIGHT
  //     });
  //   }
  // }

  onUserResponse(cell, row) {
    let componentRef = this;
    // <i class="far fa-meh"></i>
    return (
      <Link to={this}>
        <i class="fa fa-trash" title="Delete" />
      </Link>
    );
  }
  //onClick={() => componentRef.deleteConfirm(row._id)}
  // formatStartDate(cell, row) {
  //   return cell ? moment(cell).format("DD/MM/YYYY") : "";
  // }

  render() {
    const sortingOptions = {
      defaultSortName: "Subject",
      defaultSortOrder: "asc",
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
          <Col xs="6" md="3">
            &nbsp;&nbsp;
          </Col>
        </FormGroup>
        <br />
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <FormGroup row className="marginBottomZero">
                    <Col xs="6" md="3">
                      <h1 className="regHeading paddingTop8">
                        Email Sentiment Analysis
                      </h1>
                    </Col>
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <BootstrapTable
                    ref="table"
                    data={this.props.emailAnalysisData}
                    pagination={true}
                    search={true}
                    options={sortingOptions}
                    exportCSV={true}
                    csvFileName="Analysis List"
                    version="4"
                  >
                    <TableHeaderColumn
                      dataField="Id"
                      headerAlign="left"
                      align="left"
                      width={30}
                      isKey
                      hidden={true}
                    >
                      Id
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="Subject"
                      headerAlign="left"
                      align="left"
                      width={30}
                      dataSort={true}
                    >
                      Subject
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="Sender"
                      headerAlign="left"
                      align="left"
                      width={30}
                      dataSort={true}
                    >
                      Sender
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="CreatedAt"
                      headerAlign="left"
                      align="left"
                      // dataFormat={this.formatStartDate.bind(this)}
                      width={20}
                      hidden={true}
                      dataSort={true}
                    >
                      CreatedAt
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="Verified"
                      dataFormat={this.onUserResponse.bind(this)}
                      headerAlign="left"
                      align="left"
                      width={10}
                      export={false}
                    >
                      Response
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="Verified"
                      dataFormat={this.onUserResponse.bind(this)}
                      headerAlign="left"
                      align="left"
                      width={10}
                      export={false}
                    >
                      Response
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

const matchDispatchToProps = dispatch => {
  return {
    getEmailData: () => dispatch(actions.getEmailData())
  };
};

export default connect(
  mapStateToProps,
  matchDispatchToProps
)(Dashboard);
