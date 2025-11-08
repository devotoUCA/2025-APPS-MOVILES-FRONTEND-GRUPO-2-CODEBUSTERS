import {
    LOGIN_FAILURE,
    LOGIN_PENDING,
    LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_FAILURE,
    REGISTER_PENDING,
    REGISTER_SUCCESS,
    RESTORE_SESSION
} from '../actionTypes/authActionTypes';

const initialState = {
  player: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

export default function authReducer(state = initialState, action: any) {
  switch (action.type) {
    case LOGIN_PENDING:
    case REGISTER_PENDING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case RESTORE_SESSION:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        player: action.payload,
        error: null,
      };
    
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isLoggedIn: false,
      };
    
    case LOGOUT:
      return {
        ...initialState
      };
    
    default:
      return state;
  }
}