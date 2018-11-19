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
