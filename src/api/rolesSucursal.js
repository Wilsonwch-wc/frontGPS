import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const API_URL = API_BASE_URL;

// Configurar axios con el token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Obtener todos los tipos de sucursales
export const getRolesSucursal = async () => {
    try {
        const response = await axios.get(`${API_URL}/roles-sucursal`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error al obtener tipos de sucursales:', error);
        throw error;
    }
};

// Obtener tipo de sucursal por ID
export const getRolSucursalById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/roles-sucursal/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error al obtener tipo de sucursal:', error);
        throw error;
    }
};

// Crear nuevo tipo de sucursal
export const createRolSucursal = async (rolData) => {
    try {
        const response = await axios.post(`${API_URL}/roles-sucursal`, rolData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error al crear tipo de sucursal:', error);
        throw error;
    }
};

// Actualizar tipo de sucursal
export const updateRolSucursal = async (id, rolData) => {
    try {
        const response = await axios.put(`${API_URL}/roles-sucursal/${id}`, rolData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error al actualizar tipo de sucursal:', error);
        throw error;
    }
};

// Eliminar tipo de sucursal
export const deleteRolSucursal = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/roles-sucursal/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error al eliminar tipo de sucursal:', error);
        throw error;
    }
};

export default {
    getRolesSucursal,
    getRolSucursalById,
    createRolSucursal,
    updateRolSucursal,
    deleteRolSucursal
};