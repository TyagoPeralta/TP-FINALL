// ============================================================
// validarProducto.test.js
// Tests Unitarios — Practice Software Testing (Toolshop)
// Stack: Mocha v11 + Chai v6 + Sinon v21 + NYC v18
//
// UT01 → Happy Path  (assert)
// UT02 → Stub Sinon  (should)
// UT03 → Edge Path   (expect)
// ============================================================

"use strict";

const assert = require("assert");
const { expect } = require("chai");
const chai = require("chai");
chai.should();

const sinon = require("sinon");
const main = require("../validarProducto");

// ──────────────────────────────────────────────────────────────
// UT01 — Happy Path
// Verifica que un producto con todos los campos válidos
// es aceptado correctamente por el sistema.
// Chai style: assert
// ──────────────────────────────────────────────────────────────
describe("UT01 — Happy Path: producto válido", function () {
  it("debe retornar { valido: true } para un martillo con datos correctos", function () {
    // ── Arrange ──
    const producto = {
      nombre: "Martillo de carpintero",
      precio: 14.99,
      cantidad: 50,
      categoria: "hand-tools",
    };

    // ── Act ──
    const resultado = main.validarProducto(producto);

    // ── Assert ──
    assert.strictEqual(resultado.valido, true);
    assert.strictEqual(resultado.nombre, "Martillo de carpintero");
    assert.strictEqual(resultado.precio, 14.99);
    assert.strictEqual(resultado.cantidad, 50);
    assert.strictEqual(resultado.categoria, "hand-tools");
  });
});

// ──────────────────────────────────────────────────────────────
// UT02 — Stub con Sinon
// Inyecta la categoría ficticia "rental-tools" en la función
// getCategoriasValidas() mediante un Stub de Sinon, y verifica
// que el sistema acepta el producto bajo esa nueva lista.
// Chai style: should
// ──────────────────────────────────────────────────────────────
describe("UT02 — Stub: categoría ficticia 'rental-tools' inyectada por Sinon", function () {
  let stub;

  beforeEach(function () {
    // Reemplaza getCategoriasValidas() para devolver una lista extendida
    stub = sinon
      .stub(main, "getCategoriasValidas")
      .returns(["hand-tools", "power-tools", "other", "storage", "safety", "rental-tools"]);
  });

  afterEach(function () {
    // Siempre restaurar el stub para no contaminar otros tests
    stub.restore();
  });

  it("debe aceptar un producto con categoría 'rental-tools' gracias al Stub", function () {
    // ── Arrange ──
    const producto = {
      nombre: "Taladro de alquiler",
      precio: 99.99,
      cantidad: 5,
      categoria: "rental-tools",
    };

    // ── Act ──
    const resultado = main.validarProducto(producto);

    // ── Assert (estilo should) ──
    resultado.valido.should.equal(true);
    resultado.categoria.should.equal("rental-tools");
    resultado.precio.should.be.above(0);

    // Verificar que el stub fue llamado exactamente una vez
    sinon.assert.calledOnce(stub);
  });
});

// ──────────────────────────────────────────────────────────────
// UT03 — Edge Path
// Verifica que un precio negativo lanza un Error controlado
// con el mensaje exacto esperado.
// Chai style: expect
// ──────────────────────────────────────────────────────────────
describe("UT03 — Edge Path: precio negativo lanza Error controlado", function () {
  it("debe lanzar Error con mensaje 'El precio debe ser un número mayor a cero'", function () {
    // ── Arrange ──
    const productoInvalido = {
      nombre: "Llave inglesa",
      precio: -5,       // ← valor inválido que activa el error
      cantidad: 10,
      categoria: "hand-tools",
    };

    // ── Act & Assert ──
    // IMPORTANTE: se envuelve en function(){} para que Chai
    // capture el throw antes de que explote el test.
    expect(function () {
      main.validarProducto(productoInvalido);
    }).to.throw(Error, "El precio debe ser un número mayor a cero");
  });

  it("debe lanzar Error si el precio es cero", function () {
    const productoConPrecioCero = {
      nombre: "Destornillador",
      precio: 0,
      cantidad: 20,
      categoria: "hand-tools",
    };

    expect(function () {
      main.validarProducto(productoConPrecioCero);
    }).to.throw(Error, "El precio debe ser un número mayor a cero");
  });

  it("debe lanzar Error si la categoría no existe en la lista", function () {
    const productoConCategoriaInvalida = {
      nombre: "Pintura roja",
      precio: 8.50,
      cantidad: 30,
      categoria: "pinturas",   // categoría no contemplada
    };

    expect(function () {
      main.validarProducto(productoConCategoriaInvalida);
    }).to.throw(Error, "Categoría no válida");
  });
});
