import * as actionTypes from "../actions/actionTypes";

const initialState = {
  emailAnalysisData: [],
  loading: false,
  emailDataUpdated: false,
  errorMessage: "",
  error: false
};
const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_EMAILDATA_SUCCESS:
      return {
        ...state,
        emailAnalysisData: action.emailAnalysisData,
        getEmailDataflag: true
      };
    case actionTypes.GET_EMAILDATA_FAIL:
      return {
        ...state,
        error: true,
        errorMessage: action.error,
        getEmailDataflag: false
      };
    case actionTypes.UPDATE_EMAILDATA_SUCCESS:
      return {
        ...state,
        emailDataUpdated: true
      };
    case actionTypes.UPDATE_EMAILDATA_FAIL:
      return {
        ...state,
        emailDataUpdated: false
      };
    default:
      return state;
  }
};
export default dashboardReducer;
