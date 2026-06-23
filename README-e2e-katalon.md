# 🔴 Parte 3: Tests E2E (Katalon Studio) — Practice Software Testing (Toolshop)

## UNSTA 2026 | Testeo Automatizado

**Aplicación bajo prueba:** [https://practicesoftwaretesting.com](https://practicesoftwaretesting.com)  
**Tool:** Katalon Studio v10+ · Record & Playback + Groovy Scripts + Selenium  
**Navegador:** Google Chrome

---

## 📋 Descripción General

Los tests E2E validan flujos completos de usuario en la interfaz real de Toolshop, tal como los experimentaría una persona en un navegador. Se usan tres casos de prueba que cubren los recorridos más críticos del sitio: exploración del catálogo, login exitoso y login fallido.

---

## 📁 Estructura de archivos

```
e2e-katalon/
  ├── TP-Final.prj                    ← Archivo de proyecto Katalon Studio
  ├── Test Cases/
  │    ├── E2E01_ExplorarCatalogo.tc  ← Caso de prueba 1
  │    ├── E2E02_LoginExitoso.tc      ← Caso de prueba 2
  │    └── E2E03_LoginFallido.tc      ← Caso de prueba 3
  ├── Scripts/
  │    ├── E2E01_ExplorarCatalogo/    ← Script Groovy grabado
  │    ├── E2E02_LoginExitoso/        ← Script Groovy grabado
  │    └── E2E03_LoginFallido/        ← Script Groovy grabado
  ├── Object Repository/
  │    └── Page_Toolshop/             ← Localizadores XPath/CSS de elementos HTML
  ├── Test Suites/
  │    └── Suite_TP_Final.ts          ← Suite que agrupa los 3 tests
  └── README.md                       ← Este archivo
```

---

## 🧪 Tests implementados

---

### E2E01 — Explorar catálogo y aplicar filtro por categoría (Happy Path)

**Flujo:**  
`Home → "Hand Tools" → Ver productos → Aplicar filtro "Hammer"`

**Objetivo:** Verificar que el catálogo carga correctamente y que el filtro por nombre responde mostrando resultados relevantes.

**Pasos del script Groovy:**

```groovy
// E2E01_ExplorarCatalogo.groovy

WebUI.openBrowser("https://practicesoftwaretesting.com")
WebUI.waitForPageLoad(5)

// Navegar a categoría "Hand Tools"
WebUI.click(findTestObject("Page_Toolshop/nav_HandTools"))
WebUI.waitForPageLoad(5)

// Verificar que el catálogo tiene productos
WebUI.verifyElementVisible(findTestObject("Page_Toolshop/div_ProductGrid"))

// Buscar "Hammer" en el campo de búsqueda
WebUI.clearText(findTestObject("Page_Toolshop/input_Search"))
WebUI.sendKeys(findTestObject("Page_Toolshop/input_Search"), "Hammer")
WebUI.delay(1)  // Esperar debounce del campo de búsqueda

// Verificar que aparece al menos un resultado con "Hammer"
WebUI.verifyElementVisible(findTestObject("Page_Toolshop/span_ProductName_Hammer"))

WebUI.closeBrowser()
```

**Verificación clave:** `verifyElementVisible` sobre el primer resultado "Hammer"  
**Configuración de falla:** `STOP_ON_FAILURE`  
**Resultado esperado:** ✅ PASSING

---

### E2E02 — Login exitoso y acceso a perfil (Happy Path)

**Flujo:**  
`Home → Sign In → Ingresar credenciales válidas → Ver "My Account"`

**Objetivo:** Verificar que el flujo de autenticación funciona de extremo a extremo y el usuario queda logueado en la zona privada.

**Credenciales usadas:**  
`customer@practicesoftwaretesting.com` / `welcome01` (usuario público de prueba del proyecto)

**Pasos del script Groovy:**

```groovy
// E2E02_LoginExitoso.groovy

WebUI.openBrowser("https://practicesoftwaretesting.com/auth/login")
WebUI.waitForPageLoad(5)

// Ingresar credenciales
WebUI.setText(findTestObject("Page_Toolshop/input_Email"), "customer@practicesoftwaretesting.com")
WebUI.setText(findTestObject("Page_Toolshop/input_Password"), "welcome01")
WebUI.click(findTestObject("Page_Toolshop/button_Login"))

WebUI.waitForPageLoad(5)

// Verificar que el usuario llegó al área privada
WebUI.verifyElementVisible(findTestObject("Page_Toolshop/heading_MyAccount"))

WebUI.closeBrowser()
```

**Verificación clave:** `verifyElementVisible` sobre el encabezado "My Account"  
**Configuración de falla:** `STOP_ON_FAILURE`  
**Resultado esperado:** ✅ PASSING

---

### E2E03 — Login con contraseña incorrecta (Edge Path)

**Flujo:**  
`Home → Sign In → Ingresar contraseña errónea → Ver mensaje de error`

**Objetivo:** Verificar que al ingresar credenciales inválidas, el sistema muestra el mensaje de error correspondiente en la UI.

**Pasos del script Groovy:**

```groovy
// E2E03_LoginFallido.groovy

WebUI.openBrowser("https://practicesoftwaretesting.com/auth/login")
WebUI.waitForPageLoad(5)

// Ingresar credenciales con contraseña incorrecta
WebUI.setText(findTestObject("Page_Toolshop/input_Email"), "customer@practicesoftwaretesting.com")
WebUI.setText(findTestObject("Page_Toolshop/input_Password"), "contraseñaEquivocada123")
WebUI.click(findTestObject("Page_Toolshop/button_Login"))

// Esperar 1 segundo: Angular procesa la respuesta 401 del backend y renderiza el mensaje
WebUI.delay(1)

// Verificar que aparece el mensaje de error en el DOM
WebUI.verifyElementVisible(findTestObject("Page_Toolshop/div_ErrorMessage"))

WebUI.closeBrowser()
```

**Verificación clave:** `verifyElementVisible` sobre el `div` del mensaje de error  
**Configuración de falla:** `STOP_ON_FAILURE`  
**Resultado esperado:** ✅ PASSING

---

## 📊 Resumen de resultados

| Test  | Flujo                              | Tipo       | Verificación clave                         | Estado  |
| ----- | ---------------------------------- | ---------- | ------------------------------------------ | ------- |
| E2E01 | Home → Hand Tools → Filtro "Hammer"| Happy Path | Producto "Hammer" visible en catálogo      | ✅ PASS |
| E2E02 | Login → My Account                 | Happy Path | Encabezado "My Account" visible            | ✅ PASS |
| E2E03 | Login con contraseña incorrecta    | Edge Path  | Mensaje de error visible en pantalla       | ✅ PASS |

**3/3 scripts grabados** con `verifyElementVisible` y `STOP_ON_FAILURE`

---

## ▶️ Cómo ejecutar

1. Instalar **Katalon Studio** v10 o superior (descarga gratuita en [katalon.com](https://katalon.com))
2. Abrir el archivo `TP-Final.prj` desde Katalon Studio
3. Ir a **Test Suites** → seleccionar `Suite_TP_Final`
4. Hacer clic en **Run** (ícono ▶️) con el navegador Chrome seleccionado
5. El reporte HTML se genera automáticamente en `Reports/`

---

## 🗺️ Trazabilidad

| Test  | Acción del usuario              | Elemento verificado                  | Módulo UI         |
| ----- | ------------------------------- | ------------------------------------ | ----------------- |
| E2E01 | Filtrar catálogo por "Hammer"   | `Page_Toolshop/span_ProductName_Hammer` | Catálogo         |
| E2E02 | Iniciar sesión con éxito        | `Page_Toolshop/heading_MyAccount`    | Autenticación     |
| E2E03 | Iniciar sesión con error        | `Page_Toolshop/div_ErrorMessage`     | Autenticación     |

### Localizadores en el Object Repository

Los localizadores se capturan automáticamente con el **Record & Playback** de Katalon y quedan almacenados en `Object Repository/Page_Toolshop/`. Ejemplo:

```
Page_Toolshop/button_Login
  → XPath: //button[@data-testid='login-submit'] 
     (o el que capture Katalon durante el grabado)

Page_Toolshop/div_ErrorMessage
  → XPath: //div[contains(@class,'alert-danger')]
```

> **Importante:** Los XPath exactos dependen del DOM real capturado durante el Record & Playback. Siempre verificar que los localizadores siguen siendo válidos si la UI cambia.

---

## ❓ Q&A — Defensa

### Q: ¿Por qué solo 3 tests E2E y no más?

Por la **Pirámide de Testing**. Los tests E2E son los más costosos de escribir, los más frágiles ante cambios de UI y los más lentos de ejecutar. Se reservan únicamente para los flujos más críticos de negocio: que el catálogo funcione, que el usuario pueda entrar y que los errores de login se muestren correctamente. La cobertura del resto de los casos se logra a menor costo con tests unitarios y de integración.

### Q: ¿Por qué hay un `WebUI.delay(1)` en E2E03 antes de verificar el mensaje de error?

Porque **Angular es asíncrono**. Cuando el usuario hace clic en "Login", el frontend realiza una petición HTTP al backend. El backend responde con `401 Unauthorized` y Angular debe recibir esa respuesta, procesarla en el componente y renderizar el elemento de error en el árbol DOM. Si Katalon buscara el elemento inmediatamente después del clic, el `div` de error todavía no existiría y el test fallaría con `Element not found`. El delay de 1 segundo le da tiempo a Angular para completar ese ciclo.

### Q: ¿Qué es el Object Repository y para qué sirve?

Es la "libreta de contactos" de Katalon: una base de datos interna donde se guardan los localizadores (XPath o CSS) de todos los elementos HTML con los que el test interactúa. En lugar de hardcodear `//button[@id='login']` dentro del script Groovy, se usa `findTestObject("Page_Toolshop/button_Login")`. Esto centraliza los localizadores: si el HTML cambia, se actualiza en un solo lugar y todos los tests que usan ese elemento se benefician automáticamente.

### Q: ¿Qué es `STOP_ON_FAILURE` y cuándo conviene cambiarlo?

Es la política de falla del test: si un paso falla, Katalon detiene el script inmediatamente en lugar de continuar. Esto evita que pasos posteriores fallen en cascada por un error previo y hace que el reporte señale el origen real del problema. La alternativa es `CONTINUE_ON_FAILURE`, útil cuando se quiere recolectar todos los errores posibles en una sola ejecución (como en un smoke test extenso).

### Q: ¿Podría correr estos tests en CI/CD sin Katalon Studio instalado?

Sí, con **Katalon Runtime Engine** (KRE), que es la versión headless de Katalon para pipelines. Sin embargo, requiere licencia. Como alternativa gratuita, los mismos flujos podrían migrarse a **Playwright** o **Cypress**, que son open source y se integran fácilmente con GitHub Actions o Jenkins.
