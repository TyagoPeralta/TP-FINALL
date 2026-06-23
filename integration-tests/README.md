# 🟢 Parte 2: Tests de Integración — Practice Software Testing (Toolshop)

## UNSTA 2026 | Testeo Automatizado

**Aplicación bajo prueba:** [Toolshop](https://practicesoftwaretesting.com/) — tienda online de herramientas  
**API probada:** `https://api.practicesoftwaretesting.com`  
**Documentación Swagger:** `https://api.practicesoftwaretesting.com/api/documentation`

---

## 📋 Descripción General

Se testean **4 endpoints reales** de la API REST de Toolshop en producción. La colección cubre los módulos de productos y autenticación, validando tanto flujos exitosos como de error y seguridad.

Los tests corren con **Newman** (CLI de Postman) y generan un reporte HTML interactivo automáticamente.

---

## 📁 Estructura de archivos

```
integration-tests/
  ├── Toolshop_Collection.json        ← Colección Newman (4 requests + assertions)
  ├── Toolshop_Environment.json       ← Variable {{baseUrl}}
  ├── postman/                        ← Carpeta de sincronización Postman v11 (YAML)
  ├── newman/                         ← Reporte HTML generado automáticamente
  └── README.md                       ← Este archivo
```

---

## 🧪 Tests implementados

### IT01 — `GET /products` · Listado de productos con paginación

**Qué valida:**
- Status `200 OK`
- El body contiene un array `data` no vacío
- Existe paginación (`meta.total > 0` y `meta.current_page === 1`)

**Request:**
```
GET https://api.practicesoftwaretesting.com/products
```

**Scripts de test en Postman:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Array de productos no vacío", () => {
    const json = pm.response.json();
    pm.expect(json.data).to.be.an("array").that.is.not.empty;
});

pm.test("Paginación presente", () => {
    const json = pm.response.json();
    pm.expect(json.meta.total).to.be.above(0);
    pm.expect(json.meta.current_page).to.equal(1);
});
```

**Resultado:** ✅ 3 assertions PASSING

---

### IT02 — `POST /users/login` · Autenticación exitosa

**Qué valida:**
- Status `200 OK`
- El body contiene un `access_token` (string no vacío)
- El token se guarda como variable de entorno `{{authToken}}` para reutilizar en IT04

**Request:**
```
POST https://api.practicesoftwaretesting.com/users/login
Content-Type: application/json

{
  "email": "customer@practicesoftwaretesting.com",
  "password": "welcome01"
}
```

> **Nota:** Este usuario es público y de uso educativo, proporcionado oficialmente por el proyecto Toolshop.

**Scripts de test en Postman:**
```javascript
pm.test("Status 200", () => {
    pm.response.to.have.status(200);
});

pm.test("Token recibido", () => {
    const json = pm.response.json();
    pm.expect(json.access_token).to.be.a("string").that.is.not.empty;
    pm.environment.set("authToken", json.access_token);
});
```

**Resultado:** ✅ 2 assertions PASSING

---

### IT03 — `GET /products/INVALID-ID` · Error por ID inválido

**Qué valida:**
- Status `404` (producto no encontrado con ID que no existe)
- El mensaje de error está presente en el body

**Request:**
```
GET https://api.practicesoftwaretesting.com/products/9999999
```

**Scripts de test en Postman:**
```javascript
pm.test("Status 404 para ID inexistente", () => {
    pm.response.to.have.status(404);
});

pm.test("Mensaje de error presente", () => {
    const json = pm.response.json();
    pm.expect(json).to.have.property("message");
});
```

**Resultado:** ✅ 2 assertions PASSING

---

### IT04 — `GET /account` · Acceso a zona privada sin token

**Qué valida:**
- Seguridad: Status `401 Unauthorized` al intentar acceder sin Bearer Token
- El body contiene un mensaje indicando falta de autenticación

**Request:**
```
GET https://api.practicesoftwaretesting.com/account
(sin header Authorization)
```

**Scripts de test en Postman:**
```javascript
pm.test("Status 401 sin token", () => {
    pm.response.to.have.status(401);
});

pm.test("Mensaje de error de autenticación", () => {
    const json = pm.response.json();
    pm.expect(json.message).to.be.a("string").that.is.not.empty;
});
```

**Resultado:** ✅ 2 assertions PASSING

---

## 📊 Resumen de resultados

| Test | Endpoint                         | Método | Assertions | Estado |
| ---- | -------------------------------- | ------ | ---------- | ------ |
| IT01 | `/products`                      | GET    | 3/3        | ✅ PASS |
| IT02 | `/users/login`                   | POST   | 2/2        | ✅ PASS |
| IT03 | `/products/9999999`              | GET    | 2/2        | ✅ PASS |
| IT04 | `/account` (sin token)           | GET    | 2/2        | ✅ PASS |
| **Total** |                             |        | **9/9**    | ✅ 0 Failures |

---

## 🌍 Environment: `Toolshop_Environment.json`

```json
{
  "name": "Toolshop Environment",
  "values": [
    {
      "key": "baseUrl",
      "value": "https://api.practicesoftwaretesting.com",
      "enabled": true
    },
    {
      "key": "authToken",
      "value": "",
      "enabled": true
    }
  ]
}
```

Con esta estructura, si el equipo quisiera testear contra un entorno local (`http://localhost:8091`), sólo se cambia el valor de `baseUrl` sin tocar ninguna request.

---

## ▶️ Comandos de ejecución

```bash
# Instalar Newman y el reporter HTML
npm install -g newman
npm install -g newman-reporter-htmlextra

# Correr la colección y generar reporte HTML
npm run test:integration
```

**`package.json` (scripts relevantes):**

```json
{
  "scripts": {
    "test:integration": "newman run integration-tests/Toolshop_Collection.json -e integration-tests/Toolshop_Environment.json -r htmlextra --reporter-htmlextra-export integration-tests/newman/report.html"
  }
}
```

El reporte HTML queda en `integration-tests/newman/report.html` y puede abrirse en cualquier navegador.

---

## 🗺️ Trazabilidad

| Test | Tipo        | Módulo API        | ¿Qué cubre?                                        |
| ---- | ----------- | ----------------- | -------------------------------------------------- |
| IT01 | Happy Path  | Productos         | Listado público con paginación                     |
| IT02 | Happy Path  | Autenticación     | Login exitoso y obtención de token JWT             |
| IT03 | Error Path  | Productos         | Respuesta ante ID de producto inexistente           |
| IT04 | Seguridad   | Cuenta de usuario | Rechazo de acceso a recurso privado sin token      |

---

## ❓ Q&A — Defensa

### Q: ¿Por qué usar `{{baseUrl}}` en el Environment en vez de escribir la URL directa?

Para desacoplar la colección del entorno. Hoy los tests apuntan a producción (`https://api.practicesoftwaretesting.com`). Si mañana alguien levanta el proyecto localmente con Docker (`http://localhost:8091`), crea un nuevo Environment con ese valor y ejecuta exactamente la misma colección sin modificar ninguna request.

### Q: ¿Por qué IT02 guarda el token en una variable de entorno?

Porque evita repetir el login en cada test que necesite autenticación. Al guardar `authToken` en `pm.environment.set(...)`, el token queda disponible para cualquier request posterior de la misma ejecución que use `{{authToken}}` como Bearer Token.

### Q: ¿Por qué no testeaste el login fallido con Postman en vez de en Katalon?

Separación de capas. El objetivo de los tests de integración es validar la **API pura** (HTTP request → response). El flujo de login fallido que el *usuario ve en la pantalla* corresponde a una validación de la UI, que es responsabilidad de los tests E2E en Katalon. A nivel API también se podría testear el 401/422 del endpoint de login, pero se reservó ese flujo para la capa E2E por ser más representativo del recorrido del usuario.

### Q: ¿Newman necesita que Postman esté instalado para correr?

No. Newman es una herramienta CLI independiente que se instala con npm. Lee el archivo JSON de la colección directamente y no requiere la app de Postman para ejecutarse. Esto lo hace ideal para integrar en pipelines de CI/CD.

### Q: ¿Qué pasa si el servidor de Toolshop está caído durante los tests?

Newman reportará `connection refused` o timeout y todos los tests fallarán. Es una limitación de los tests de integración contra entornos externos: dependen de la disponibilidad del servicio. Para mitigarlo en proyectos reales se usan **mocks del servidor** (como `json-server` o WireMock) en entornos de CI.
