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

  onEditRoom(cell, row) {
    return (
      <Link
        to={`${this.props.match.url}/rooms/${row._id}`}
        onClick={() => this.getRoomToEdit(row)}
      >
        <i className="fa fa-pencil" title="Edit" />
      </Link>
    );
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
          <Col xs="6" md="3">
           
          </Col>
        </FormGroup>
        <br />
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <FormGroup row className="marginBottomZero">
                    <Col xs="12" md="4">
                      <h1 className="regHeading paddingTop8">emailData List</h1>
                    </Col>
                    <Col xs="10" md="3">
                    </Col>
                  </FormGroup>
                </CardHeader>
                <CardBody>
                  <BootstrapTable
                    ref="table"
                    data={this.props.emailAnalysisData}
                    pagination={true}
                    search={true}
                    options={options}
                    exportCSV={true}
                    csvFileName="emailData List"
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
                    {/* <TableHeaderColumn
                      dataField="Subject"
                      headerAlign="left"
                      width="30"
                      dataSort={true}
                    >
                    Subject
                    </TableHeaderColumn> */}

                    <TableHeaderColumn
                      dataField="roomName"
                      headerAlign="left"
                      width="30"
                      dataSort={true}
                    >
                      Room Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="capacity"
                      headerAlign="left"
                      width="100"
                      dataSort={true}
                    >
                      Capacity
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
    getEmailData: () => dispatch(actions.getEmailData())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
