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
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/room`)
      .then(response => {
        dispatch(getEmailDataSuccess(response.data));
      })
      .catch(error => {
        dispatch(getEmailDataFail(error));
      });
  };
};

export const updateEmailData = emailData => {
  let id = emailData.id;
  let emailDataObj = _.pick(emailData, [
    "emailDataName",
    "venue",
    "description",
    "startDate",
    "endDate",
    "emailDataLogo"
  ]);
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/emailData/${id}`, emailDataObj)
      .then(response => {
        dispatch(updateEmailDataSuccess(response.data.Id, emailData));
      })
      .catch(error => {
        dispatch(updateEmailDataFail(error));
      });
  };
};
