# 🎯 TP Final – Testeo Automatizado

## UNSTA 2026

**Aplicación bajo prueba:** [Toolshop](https://practicesoftwaretesting.com/) — tienda online de herramientas para practicar software testing  
**Backend API:** [https://api.practicesoftwaretesting.com](https://api.practicesoftwaretesting.com) (Laravel + PHP + MySQL + JWT)  
**Documentación Swagger:** [https://api.practicesoftwaretesting.com/api/documentation](https://api.practicesoftwaretesting.com/api/documentation)

---

## 📐 Estructura General del Proyecto

```
TP-Final/
  ├── package.json                        ← Scripts: test:unit, coverage, test:integration
  ├── README.md                           ← Este archivo
  │
  ├── unit-tests/                         🔵 PARTE 1: Tests Unitarios
  │    ├── validarProducto.js             ← Módulo lógico espejo del backend (sin dependencias)
  │    ├── test/
  │    │    └── validarProducto.test.js   ← 5 tests: Mocha + Chai + Sinon
  │    └── README.md                      ← Documentación, trazabilidad y Q&A
  │
  ├── integration-tests/                  🟢 PARTE 2: Tests de Integración
  │    ├── Toolshop_Collection.json       ← Colección Newman (4 requests + 13 assertions)
  │    ├── Toolshop_Environment.json      ← Variable {{baseUrl}} y {{authToken}}
  │    ├── newman/                        ← Reporte HTML generado automáticamente
  │    └── README.md                      ← Documentación, scripts y Q&A
  │
  └── e2e-katalon/                        🔴 PARTE 3: Tests E2E
       ├── TP-Final.prj                   ← Archivo de proyecto Katalon Studio
       ├── Scripts/
       │    ├── E2E01_ExplorarCatalogo/Script.groovy
       │    ├── E2E02_LoginExitoso/Script.groovy
       │    └── E2E03_LoginFallido/Script.groovy
       ├── Object Repository/
       │    └── Page_Toolshop/            ← Localizadores XPath/CSS de elementos HTML
       └── README.md                      ← Documentación, trazabilidad y Q&A
```

---

## 🛠️ Stack Tecnológico

| Herramienta                   | Versión | Capa        | Uso                                           |
| ----------------------------- | ------- | ----------- | --------------------------------------------- |
| **Mocha**                     | ^11     | Unitaria    | Framework de ejecución de tests en Node.js    |
| **Chai**                      | ^6      | Unitaria    | Aserciones: `assert`, `expect`, `should`      |
| **Sinon.js**                  | ^21     | Unitaria    | Dobles de prueba: `Stub` para aislamiento     |
| **NYC (Istanbul)**            | ^18     | Unitaria    | Cobertura de código (Coverage Report)         |
| **Postman**                   | v11     | Integración | Diseño visual de requests y scripts de test   |
| **Newman**                    | ^6      | Integración | Ejecución CLI de colecciones Postman          |
| **newman-reporter-htmlextra** | ^1      | Integración | Reporte HTML interactivo post-ejecución       |
| **Katalon Studio**            | v10+    | E2E         | Record & Playback + Groovy Scripts + Selenium |

---

## 🔵 Parte 1: Tests Unitarios

**Módulo probado:** `validarProducto.js` — replica la lógica de validación de productos del catálogo Toolshop.

| Test | Tipo       | Descripción                                                   | Chai Style |
| ---- | ---------- | ------------------------------------------------------------- | ---------- |
| UT01 | Happy Path | Producto válido (nombre, precio, cantidad, categoría correctos)| `assert`   |
| UT02 | Stub       | Categoría ficticia `"rental-tools"` inyectada por Sinon       | `should`   |
| UT03a| Edge Path  | Precio negativo `-5` lanza `Error` controlado                 | `expect`   |
| UT03b| Edge Path  | Precio cero `0` lanza `Error` controlado                      | `expect`   |
| UT03c| Edge Path  | Categoría inválida `"pinturas"` lanza `Error` controlado      | `expect`   |

**Resultado esperado:** ✅ 5/5 PASSING · Cobertura: ~78%

```bash
npm run test:unit    # Correr los tests
npm run coverage     # Correr con reporte de cobertura NYC
```

---

## 🟢 Parte 2: Tests de Integración

**API probada:** `https://api.practicesoftwaretesting.com` — API REST de Toolshop en producción.

| Test | Endpoint                               | Método | Assertions | Qué valida                               |
| ---- | -------------------------------------- | ------ | ---------- | ---------------------------------------- |
| IT01 | `/products?page=1`                     | GET    | 4/4        | Status 200 + array data + paginación     |
| IT02 | `/users/login`                         | POST   | 3/3        | Login exitoso + JWT recibido y guardado  |
| IT03 | `/products/nonexistent-product-id-...` | GET    | 3/3        | Status 404 + mensaje de error            |
| IT04 | `/account` (sin token)                 | GET    | 3/3        | Status 401 + no expone datos privados    |

**Resultado esperado:** ✅ 4/4 Requests · 13/13 Assertions · 0 Failures

```bash
npm run test:integration   # Correr Newman + generar reporte HTML
```

---

## 🔴 Parte 3: Tests E2E

**App probada:** [https://practicesoftwaretesting.com](https://practicesoftwaretesting.com) — flujos reales en Chrome.

| Test  | Flujo                                     | Tipo       | Verificación clave                            |
| ----- | ----------------------------------------- | ---------- | --------------------------------------------- |
| E2E01 | Home → Hand Tools → Buscar "Hammer"       | Happy Path | Producto "Hammer" visible en catálogo         |
| E2E02 | Login → My Account                        | Happy Path | Encabezado "My account" visible + usuario OK  |
| E2E03 | Login con contraseña incorrecta → Error   | Edge Path  | Alert de error visible + URL sigue en /login  |

**Resultado esperado:** ✅ 3/3 scripts con `verifyElementVisible` y `STOP_ON_FAILURE`

👉 Abrir `TP-Final.prj` en Katalon Studio y ejecutar la Test Suite.

---

## ▶️ Guía Rápida de Ejecución

```bash
# 1. Instalar dependencias Node.js
npm install

# 2. Tests unitarios
npm run test:unit

# 3. Tests unitarios con cobertura
npm run coverage

# 4. Tests de integración (requiere internet)
npm run test:integration

# 5. Tests E2E → abrir TP-Final.prj en Katalon Studio
#    y ejecutar la Test Suite desde la interfaz gráfica
```

---

## ❓ Preguntas y Respuestas — Defensa

### Q1: ¿Por qué no hiciste todo con Katalon si es lo que ve el usuario real?

Los tests E2E son lentos, costosos de mantener y frágiles ante cambios de UI. La base deben ser los tests **unitarios** (rápidos, sin dependencias), luego **integración** (API real), y E2E solo para flujos críticos. Esto es la **Pirámide de Testing**.

### Q2: ¿Qué es el patrón AAA?

**Arrange-Act-Assert**: preparar datos → ejecutar función → verificar resultado. Aplicado en UT01.

### Q3: ¿Qué es un Stub de Sinon y por qué lo usaste?

Un Stub reemplaza temporalmente `getCategoriasValidas()` para devolver una lista controlada con `"rental-tools"`. Aísla la lógica de validación del entorno real sin necesitar conexión a la API.

### Q4: ¿Por qué en UT03 se envuelve la llamada en `function() { ... }`?

Porque si se llama directamente, el Error explota antes de que Chai pueda capturarlo. Al envolverlo, Chai ejecuta la función de forma controlada y atrapa el `throw`.

### Q5: ¿100% de coverage significa sin bugs?

No. Coverage mide si el test "pasó por" cada línea. No garantiza que se hayan cubierto todos los casos de negocio ni que el código haga lo correcto.

### Q6: ¿Por qué el 401 se testea en integración y no en unitario?

Porque el rechazo por falta de token lo hace el **middleware de autenticación** a nivel HTTP en Laravel. Un test unitario no levanta el servidor. Solo el test de integración evalúa la tubería completa: HTTP → Middleware → Controller.

### Q7: ¿Qué ventaja da `{{baseUrl}}` en el Environment de Postman/Newman?

Evita reescribir requests si cambia el entorno. Para testear localmente con Docker (`http://localhost:8091`), solo se cambia el valor de `baseUrl` y la colección funciona igual.

### Q8: ¿Por qué hay `WebUI.delay(2)` en E2E03?

Angular es asíncrono. El frontend hace POST al backend, espera el 401, y luego renderiza el mensaje de error en el DOM. Sin el delay, Katalon busca el elemento antes de que exista y el test falla.

### Q9: ¿Qué es el Object Repository en Katalon?

La base de datos interna de localizadores XPath/CSS de los elementos HTML. En el script Groovy, `findTestObject('Page_Toolshop/button_SignIn')` recupera el localizador y Selenium actúa sobre ese elemento del DOM.
