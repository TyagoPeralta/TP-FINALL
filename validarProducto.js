// ============================================================
// validarProducto.js
// Módulo espejo de la lógica de validación de productos
// de Practice Software Testing (Toolshop).
//
// Replica las reglas de negocio de la API Laravel sin depender
// de Express, MongoDB, ni ningún servidor externo.
// ============================================================

"use strict";

// Categorías válidas del catálogo Toolshop (espejo del backend)
const CATEGORIAS_VALIDAS = [
  "hand-tools",
  "power-tools",
  "other",
  "storage",
  "safety",
];

/**
 * Retorna la lista de categorías válidas.
 * Función separada para poder stubearla con Sinon en tests.
 * @returns {string[]}
 */
function getCategoriasValidas() {
  return CATEGORIAS_VALIDAS;
}

/**
 * Valida los datos de un producto antes de publicarlo en el catálogo.
 *
 * Reglas:
 *  - nombre   → string no vacío, requerido
 *  - precio   → número positivo (> 0)
 *  - cantidad → entero no negativo (>= 0)
 *  - categoria→ debe pertenecer a la lista de categorías válidas
 *
 * @param {Object} producto
 * @param {string} producto.nombre
 * @param {number} producto.precio
 * @param {number} producto.cantidad
 * @param {string} producto.categoria
 * @returns {{ valido: boolean, nombre: string, precio: number, cantidad: number, categoria: string }}
 * @throws {Error} Si alguna validación falla
 */
function validarProducto({ nombre, precio, cantidad, categoria }) {
  // Validar nombre
  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    throw new Error("El nombre del producto es obligatorio");
  }

  // Validar precio
  if (typeof precio !== "number" || isNaN(precio) || precio <= 0) {
    throw new Error("El precio debe ser un número mayor a cero");
  }

  // Validar cantidad (stock)
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    throw new Error("El stock debe ser un entero no negativo");
  }

  // Validar categoría
  const categoriasValidas = getCategoriasValidas();
  if (!categoriasValidas.includes(categoria)) {
    throw new Error("Categoría no válida");
  }

  return {
    valido: true,
    nombre: nombre.trim(),
    precio,
    cantidad,
    categoria,
  };
}

module.exports = { validarProducto, getCategoriasValidas };
