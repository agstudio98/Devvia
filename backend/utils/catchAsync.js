/**
 * WRAPPER PARA CONTROLADORES ASÍNCRONOS
 * 
 * Este helper elimina la necesidad de usar try/catch en cada controlador.
 * Captura automáticamente cualquier error y lo pasa al middleware central.
 * Mejora significativamente la limpieza del código.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
