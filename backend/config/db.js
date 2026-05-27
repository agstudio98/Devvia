const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    // Forzamos la lectura de la URI para depuración si fuera necesario
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27018/Devvia';
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Conectado: ${conn.connection.host} en puerto ${conn.connection.port}`);
    return true;
  } catch (error) {
    console.error(`Error de Conexión MongoDB: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
