import {
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  CLEAR_ERRORS,
} from "../Constants/UserConstants.js";
import axios from "axios";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_USER_REQUEST });
    const { data } = await axios.post(
      "http://127.0.0.1:8000/api/v1/user/login",
      { email, password },
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    console.log("data is ", data);
    dispatch({ type: LOGIN_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LOGIN_USER_FAIL, payload: error.response.data.message });
  }
};

export const clearErrors =() => async (dispatch) =>{
    dispatch({type:CLEAR_ERRORS})
}