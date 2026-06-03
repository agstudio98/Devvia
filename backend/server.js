const app = require('./app');

const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Devvia corriendo en el puerto ${PORT}`);
  console.log(`API disponible en http://0.0.0.0:${PORT}`);
});
