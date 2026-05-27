const productService = require('../services/productService');
const catchAsync = require('../utils/catchAsync');
const responseHandler = require('../utils/responseHandler');

/**
 * CONTROLADOR DE PRODUCTO (REFACTORIZADO)
 * 
 * El controlador maneja el ciclo de vida de la petición HTTP.
 * Se ha eliminado el bloque try/catch repetitivo gracias al uso de 'catchAsync'.
 * Se utiliza 'responseHandler' para estandarizar las respuestas.
 */

/**
 * Obtiene todos los productos y responde al cliente.
 */
const getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts();
  responseHandler.success(res, products);
});

/**
 * Crea un producto procesando el cuerpo de la petición.
 */
const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  responseHandler.success(res, product, 'Producto creado con éxito', 201);
});

module.exports = {
  getAllProducts,
  createProduct
};
