import API_CONFIG from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
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

export function login(email: string, password: string) {
  return async (dispatch: any) => {
    dispatch({ type: LOGIN_PENDING });
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        await AsyncStorage.setItem('player', JSON.stringify(data.player));
        dispatch({ type: LOGIN_SUCCESS, payload: data.player });
        
        
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 100);
      } else {
        dispatch({ type: LOGIN_FAILURE, payload: data.error || 'Error al iniciar sesión' });
      }
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: 'Error de conexión' });
    }
  };
}

export function register(email: string, password: string, player_name: string) {
  return async (dispatch: any) => {
    dispatch({ type: REGISTER_PENDING });
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, player_name })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        await AsyncStorage.setItem('player', JSON.stringify(data.player));
        dispatch({ type: REGISTER_SUCCESS, payload: data.player });
        
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 100);
      } else {
        dispatch({ type: REGISTER_FAILURE, payload: data.error || 'Error al registrarse' });
      }
    } catch (error) {
      dispatch({ type: REGISTER_FAILURE, payload: 'Error de conexión' });
    }
  };
}

export function logout() {
  return async (dispatch: any) => {
    await AsyncStorage.removeItem('player');
    dispatch({ type: LOGOUT });
    
    setTimeout(() => {
      router.replace("/(auth)/signin");
    }, 100);
  };
}


export function restoreSession() {
  return async (dispatch: any) => {
    try {
      const playerData = await AsyncStorage.getItem('player');
      if (playerData) {
        dispatch({ type: RESTORE_SESSION, payload: JSON.parse(playerData) });
      } else {
        dispatch({ type: RESTORE_SESSION, payload: null });
      }
    } catch (error) {
      dispatch({ type: RESTORE_SESSION, payload: null });
    }
  };
}


export function updatePlayerData(playerData: any) {
  return async (dispatch: any) => {
    try {
      await AsyncStorage.setItem('player', JSON.stringify(playerData));
      dispatch({ type: UPDATE_PLAYER_DATA, payload: playerData });
    } catch (error) {
    }
  };
}