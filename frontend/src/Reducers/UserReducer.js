import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    CLEAR_ERRORS,
  } from '../Constants/UserConstants.js';
  
  const initialState = {
    loading: false,
    user: [],
    isAuthenticatedUser: false
  };
  
  export const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOGIN_USER_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case LOGIN_USER_SUCCESS:
        return {
          ...state,
          loading: false,
          user: action.payload,
          isAuthenticatedUser:true
        };
      case LOGIN_USER_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      case CLEAR_ERRORS :
        return {
          ...state,
          error:null
        }
      default:
        return state;
    }
  };
  

  export const clearError=(state,action)=>{

  }