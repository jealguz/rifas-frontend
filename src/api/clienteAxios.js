import axios from 'axios';

// Detecta si estamos en local o en producción
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://rifas-backend-kyec.onrender.com' // <--- PON AQUÍ TU URL DE RENDER
  : 'http://localhost:3000/api';

const clienteAxios = axios.create({
  baseURL
});

export default clienteAxios;