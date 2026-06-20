import axios from 'axios';

// Instancia global apuntando a tu puerto local de Node.js
const clienteAxios = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export default clienteAxios;