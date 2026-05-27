const app = require('./app');

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor Devvia corriendo en el puerto ${PORT}`);
  console.log(`API v1 disponible en http://localhost:${PORT}/api/v1`);
});
