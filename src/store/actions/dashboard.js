import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import _ from "lodash";
import AppConfig from "../../constants/AppConfig";

export const getEmailDataSuccess = emailAnalysisData => {
  return {
    type: actionTypes.GET_EMAILDATA_SUCCESS,
    emailAnalysisData: emailAnalysisData
  };
};

export const getEmailDataFail = error => {
  return {
    type: actionTypes.GET_EMAILDATA_FAIL,
    error: error
  };
};

export const updateEmailDataFail = error => {
  return {
    type: actionTypes.CREATE_EMAILDATA_FAIL,
    error: error
  };
};

export const updateEmailDataSuccess = (emailDataId, emailData) => {
  return {
    type: actionTypes.UPDATE_EMAILDATA_SUCCESS,
    emailDataId: emailDataId,
    emailData: emailData
  };
};

///api/metadata/emaildata
export const getEmailData = () => {
  let emails = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/metadata/emaildata`)
      .then(response => {
        emails = _.filter(response.data, function(email) {
          return email.Verified === null;
        });
        dispatch(getEmailDataSuccess(emails));
      })
      .catch(error => {
        dispatch(getEmailDataFail(error));
      });
  };
};

export const updateEmailData = emailData => {
  let Id = emailData.Id;
  let emailDataObj = _.pick(emailData, ["Verified"]);
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/metadata/emailData/${Id}`, emailDataObj)
      .then(response => {
        dispatch(getEmailData());
        dispatch(updateEmailDataSuccess(response.data.Id, emailData));
      })
      .catch(error => {
        dispatch(updateEmailDataFail(error));
      });
  };
};

export const getVerifiedData = () => {
  let emailList = [],
    emailIds = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/metadata/verifiedEmails`)
      .then(response => {
        if (response.data.length > 0) {
          emailList = _.map(
            response.data,
            _.partialRight(_.pick, ["Subject", "Verified"])
          );
          emailIds = _.map(response.data, _.partialRight(_.pick, ["Id"]));
          dispatch(exportToTsv(emailList, emailIds));
        }
      });
  };
};

export const exportToTsv = (emailList, emailIds) => {
  let emailData = emailList;
  let emailDataIds = emailIds;
  return dispatch => {
    axios
      .post(
        `${AppConfig.serverURL}/api/metadata/emaildata/azurestorage`,
        emailData
      )
      .then(response => {
        dispatch(bulkUploadEmailData(emailDataIds));
        dispatch(clearEmailDataError());
      })
      .catch(response => {
        dispatch(logEmailDataError());
      });
  };
};

export const bulkUploadEmailData = emailIds => {
  let emailDataIds = emailIds;
  return dispatch => {
    axios
      .post(
        `${AppConfig.serverURL}/api/metadata/emaildata/bulkUpdate`,
        emailDataIds
      )
      .then(response => {
        dispatch(runTsvEngine());
        dispatch(clearEmailDataError());
      })
      .catch(response => {
        // console.log("error", response);
        dispatch(logEmailDataError());
      });
  };
};

export const runTsvEngine = () => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/metadata/tsvRunEngine`)
      .then(response => {
        // console.log("error", response);
        dispatch(clearEmailDataError());
      });
  };
};

export const logEmailDataError = () => {
  return {
    type: actionTypes.LOG_EMAILDATA_ERROR
  };
};

export const clearEmailDataError = () => {
  return {
    type: actionTypes.CLEAR_EMAILDATA_ERROR
  };
};
