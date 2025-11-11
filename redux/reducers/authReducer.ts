import {
  LOGIN_FAILURE,
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_PENDING,
  REGISTER_SUCCESS,
  RESTORE_SESSION,
  UPDATE_PLAYER_DATA
} from '../actionTypes/authActionTypes';

const initialState = {
  player: null,
  isLoggedIn: false,
  isLoading: true, 
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
        isLoggedIn: !!action.payload, 
        player: action.payload,
        error: null,
      };
    
    case UPDATE_PLAYER_DATA:
      return {
        ...state,
        player: action.payload,
      };
    
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isLoggedIn: false,
        player: null,
      };
    
    case LOGOUT:
      return {
        ...initialState,
        isLoading: false, 
      };
    
    default:
      return state;
  }
}