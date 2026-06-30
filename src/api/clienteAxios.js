import axios from 'axios';

// Detecta si estamos en local o en producción
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://rifas-backend-kyec.onrender.com/api'
  : 'http://localhost:3000/api';

const clienteAxios = axios.create({
  baseURL,
  timeout: 60000
});

export default clienteAxios;