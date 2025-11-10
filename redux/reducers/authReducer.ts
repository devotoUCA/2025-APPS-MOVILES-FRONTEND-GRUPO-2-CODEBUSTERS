// redux/reducers/authReducer.ts (CÓDIGO COMPLETO Y CORREGIDO)

import {
  LOGIN_FAILURE,
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_PENDING,
  REGISTER_SUCCESS,
  RESTORE_SESSION,
  UPDATE_PLAYER_DATA // 1. La nueva acción que agregamos
} from '../actionTypes/authActionTypes';

// 2. ✅ ¡AQUÍ ESTÁ LA CORRECCIÓN!
//    Esta es la variable 'initialState' que faltaba.
const initialState = {
  player: null,
  isLoggedIn: false,
  isLoading: true, // Inicia en 'true' para esperar la restauración
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
        isLoggedIn: !!action.payload, // Es true si hay payload, false si no
        player: action.payload,
        error: null,
      };
    
    // 3. ✅ El nuevo 'case' para actualizar el jugador
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
        isLoading: false, // Ya no está cargando
      };
    
    default:
      return state;
  }
}