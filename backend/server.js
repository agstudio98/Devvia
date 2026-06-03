const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Devvia corriendo en el puerto ${PORT}`);
  console.log(`API v1 disponible en http://localhost:${PORT}/api/v1`);
});
