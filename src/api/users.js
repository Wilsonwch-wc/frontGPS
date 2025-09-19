import api from './auth';

// Obtener todos los usuarios
export const getAllUsers = async () => {
  try {
    const response = await api.get('/usuarios');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Crear un nuevo usuario
export const createUser = async (userData) => {
  try {
    const response = await api.post('/usuarios', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Actualizar un usuario
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/usuarios/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Eliminar un usuario
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/usuarios/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cambiar contraseña de usuario
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/usuarios/change-password', passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtener roles disponibles
export const getRoles = async () => {
  try {
    // Asumiendo que existe un endpoint para roles, si no existe se puede crear
    const response = await api.get('/roles');
    return response.data;
  } catch (error) {
    // Si no existe el endpoint, devolver roles por defecto
    return {
      success: true,
      data: [
        { id: 1, nombre: 'Administrador' },
        { id: 2, nombre: 'Usuario' },
        { id: 3, nombre: 'Moderador' }
      ]
    };
  }
};