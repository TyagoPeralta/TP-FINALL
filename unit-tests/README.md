# 🔵 Parte 1: Tests Unitarios — Practice Software Testing (Toolshop)

## UNSTA 2026 | Testeo Automatizado

**Aplicación bajo prueba:** [Toolshop](https://practicesoftwaretesting.com/) — tienda online de herramientas  
**Módulo probado:** `validarProducto.js` — lógica de validación de productos del catálogo

---

## 📋 Descripción General

Este módulo replica las reglas de negocio que el backend de Toolshop aplica al registrar o actualizar un producto. Se testea de forma **completamente aislada**: sin red, sin base de datos, sin dependencias externas.

Las reglas validadas son:
- El precio debe ser un número positivo mayor a cero.
- El stock (`quantity`) debe ser un entero no negativo.
- La categoría debe pertenecer a la lista de categorías válidas del catálogo.

---

## 📁 Estructura de archivos

```
unit-tests/
  ├── validarProducto.js              ← Módulo lógico (lógica pura, sin Express, sin DB)
  ├── test/
  │    └── validarProducto.test.js   ← 3 tests: Mocha + Chai + Sinon
  └── README.md                      ← Este archivo
```

---

## 🧩 Módulo bajo prueba: `validarProducto.js`

```javascript
// unit-tests/validarProducto.js

const CATEGORIAS_VALIDAS = ["hand-tools", "power-tools", "other"];

function getCategoriasValidas() {
  return CATEGORIAS_VALIDAS;
}

function validarProducto({ nombre, precio, cantidad, categoria }) {
  if (!nombre || nombre.trim() === "") {
    throw new Error("El nombre del producto es obligatorio");
  }
  if (typeof precio !== "number" || precio <= 0) {
    throw new Error("El precio debe ser un número mayor a cero");
  }
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    throw new Error("El stock debe ser un entero no negativo");
  }
  const categoriasValidas = getCategoriasValidas();
  if (!categoriasValidas.includes(categoria)) {
    throw new Error("Categoría no válida");
  }
  return { valido: true, nombre, precio, cantidad, categoria };
}

module.exports = { validarProducto, getCategoriasValidas };
```

> **¿Por qué un módulo espejo?**  
> El backend real de Toolshop está en PHP/Laravel. Este módulo en JavaScript replica la misma lógica de validación para poder testearlo con el stack de la materia (Node.js + Mocha), sin necesidad de levantar ningún servidor.

---

## 🧪 Tests implementados

### UT01 — Happy Path (`assert`)

**Objetivo:** Verificar que un producto con todos los campos válidos es aceptado correctamente.

```javascript
// Arrange
const producto = {
  nombre: "Martillo de carpintero",
  precio: 14.99,
  cantidad: 50,
  categoria: "hand-tools"
};

// Act
const resultado = main.validarProducto(producto);

// Assert
assert.strictEqual(resultado.valido, true);
assert.strictEqual(resultado.nombre, "Martillo de carpintero");
```

**Tipo de Chai:** `assert`  
**Resultado esperado:** ✅ PASSING

---

### UT02 — Stub con Sinon (`should`)

**Objetivo:** Inyectar una categoría ficticia `"rental-tools"` en la lista de categorías válidas mediante un Stub, y verificar que el sistema acepta el producto bajo esa nueva lista.

```javascript
// Arrange
const stub = sinon.stub(main, "getCategoriasValidas").returns(
  ["hand-tools", "power-tools", "other", "rental-tools"]
);

const producto = {
  nombre: "Taladro de alquiler",
  precio: 99.99,
  cantidad: 5,
  categoria: "rental-tools"
};

// Act
const resultado = main.validarProducto(producto);

// Assert
resultado.valido.should.equal(true);
resultado.categoria.should.equal("rental-tools");

// Teardown
stub.restore();
```

**Tipo de Chai:** `should`  
**Resultado esperado:** ✅ PASSING

---

### UT03 — Edge Path (`expect`)

**Objetivo:** Verificar que un precio negativo (`-5`) lanza un `Error` controlado con el mensaje correcto.

```javascript
// Arrange
const productoInvalido = {
  nombre: "Llave inglesa",
  precio: -5,
  cantidad: 10,
  categoria: "hand-tools"
};

// Act & Assert
expect(function () {
  main.validarProducto(productoInvalido);
}).to.throw(Error, "El precio debe ser un número mayor a cero");
```

**Tipo de Chai:** `expect`  
**Resultado esperado:** ✅ PASSING

---

## 📊 Cobertura de código (NYC)

| Archivo              | Statements | Branches | Functions | Lines |
| -------------------- | ---------- | -------- | --------- | ----- |
| `validarProducto.js` | ~78%       | ~70%     | 100%      | ~78%  |

> La cobertura no llega al 100% porque no se testea el path de `nombre` vacío en un test dedicado (rama no cubierta en UT01-UT03). Esto es intencional para mostrar que cobertura alta ≠ ausencia de bugs.

---

## ▶️ Comandos de ejecución

```bash
# Instalar dependencias
npm install

# Correr los 3 tests
npm run test:unit

# Correr con reporte de cobertura
npm run coverage
```

**`package.json` (scripts relevantes):**

```json
{
  "scripts": {
    "test:unit": "mocha unit-tests/test/*.test.js",
    "coverage": "nyc mocha unit-tests/test/*.test.js"
  },
  "devDependencies": {
    "mocha": "^11.0.0",
    "chai": "^6.0.0",
    "sinon": "^21.0.0",
    "nyc": "^18.0.0"
  }
}
```

---

## 🗺️ Trazabilidad

| Test | Regla de negocio validada                         | Tipo       | Chai    |
| ---- | ------------------------------------------------- | ---------- | ------- |
| UT01 | Producto válido pasa todas las validaciones       | Happy Path | assert  |
| UT02 | El sistema acepta categorías inyectadas por Stub  | Stub       | should  |
| UT03 | Precio negativo lanza Error con mensaje correcto  | Edge Path  | expect  |

---

## ❓ Q&A — Defensa

### Q: ¿Por qué el módulo está en JavaScript si el backend de Toolshop es PHP/Laravel?

Porque el objetivo de los tests unitarios es validar **lógica de negocio pura**, no el stack tecnológico. Al replicar las reglas de validación en JavaScript, podemos usar Mocha + Chai sin necesidad de levantar un servidor PHP, conectarnos a una base de datos ni tener acceso al código fuente original. El comportamiento que se testea es equivalente.

### Q: ¿Qué pasa si `getCategoriasValidas()` consultara una base de datos real?

Ahí entra el **Stub de Sinon**. Si la función dependiera de una BD, el Stub la reemplaza para devolver un valor controlado, manteniendo el test rápido, reproducible y sin efectos secundarios. Es exactamente lo que se hace en UT02 para inyectar `"rental-tools"`.

### Q: ¿Por qué usar los tres estilos de Chai (assert / should / expect) en vez de uno solo?

Para demostrar la equivalencia funcional entre los tres. Todos afirman lo mismo con distinta sintaxis: `assert` es estilo clásico (TDD), `expect` es encadenado (BDD), `should` extiende el prototipo. En un proyecto real se elige uno y se mantiene consistente.

### Q: ¿Por qué `expect(...).to.throw()` necesita una función anónima?

Porque si llamáramos `main.validarProducto(productoInvalido)` directamente, el error se lanzaría **antes** de que Chai pueda capturarlo, y el test explonaría. Al envolverlo en `function() { ... }`, Chai ejecuta la función en modo controlado y atrapa el `throw`.
