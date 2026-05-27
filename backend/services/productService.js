const Product = require('../models/Product');

/**
 * SERVICIO DE PRODUCTOS / CATÁLOGO (REFINADO)
 * 
 * Centraliza la lógica de la tienda y asegura datos consistentes.
 */

const getAllProducts = async () => {
  const products = await Product.find().populate('usuario', 'nombre avatar');
  return products || [];
};

const createProduct = async (productData) => {
  const { nombre, descripcion, categoria, precio, imagen, usuario } = productData;
  
  if (!nombre || !descripcion || !categoria || !usuario) {
    throw new Error('Faltan campos obligatorios para crear el producto');
  }

  return await Product.create({
    nombre,
    descripcion,
    categoria,
    precio: precio || 0,
    imagen: imagen || 'https://via.placeholder.com/300',
    usuario
  });
};

module.exports = {
  getAllProducts,
  createProduct
};
