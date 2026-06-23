# Object Repository — Page_Toolshop

## ¿Qué es esto?

Cada archivo `.rs` en esta carpeta es un localizador de elemento HTML capturado por Katalon Studio durante el Record & Playback. Se referencian en los scripts Groovy con `findTestObject('Page_Toolshop/<nombre>')`.

Los XPath y selectores CSS aquí listados son los que deben usarse (o los que Katalon captura automáticamente durante el grabado).

---

## Localizadores por elemento

### Navegación

| Test Object Name         | Selector CSS / XPath                                          | Descripción                         |
| ------------------------ | ------------------------------------------------------------- | ----------------------------------- |
| `a_HandTools_Nav`        | `//a[@href='/category/hand-tools']`                          | Link "Hand Tools" en el navbar       |

---

### Búsqueda / Catálogo

| Test Object Name             | Selector CSS / XPath                                          | Descripción                              |
| ---------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| `div_ProductGrid`            | `//div[contains(@class,'col-md-9')]//div[@class='card']`      | Grilla de productos (confirma que cargó) |
| `input_SearchField`          | `//input[@placeholder='Search' or @data-test='search-query']` | Campo de búsqueda de productos           |
| `span_ProductName_Hammer`    | `//h5[contains(text(),'Hammer') or contains(@class,'card-title') and contains(.,'Hammer')]` | Nombre del producto "Hammer" en el catálogo |

---

### Login

| Test Object Name             | Selector CSS / XPath                                          | Descripción                              |
| ---------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| `input_Email`                | `//input[@data-test='email' or @id='email']`                 | Campo de email en el formulario de login |
| `input_Password`             | `//input[@data-test='password' or @type='password']`         | Campo de contraseña                      |
| `button_SignIn`              | `//button[@data-test='login-submit' or text()='Login']`      | Botón "Login" / "Sign in"                |

---

### Post-login

| Test Object Name             | Selector CSS / XPath                                          | Descripción                              |
| ---------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| `h1_MyAccount`               | `//h1[contains(text(),'My account')]`                        | Encabezado de la página de perfil        |
| `span_UserMenuLoggedIn`      | `//nav//span[contains(@class,'nav-link') and contains(.,'@')]` | Email del usuario en el menú (logueado) |

---

### Errores

| Test Object Name             | Selector CSS / XPath                                          | Descripción                              |
| ---------------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| `div_AlertDanger`            | `//div[contains(@class,'alert-danger') or @data-test='login-error']` | Mensaje de error de login fallido  |

---

## Nota importante

Estos localizadores se generan automáticamente al hacer **Record & Playback** en Katalon Studio.  
Si la UI de Toolshop cambia (nuevo `data-test`, clase CSS diferente, etc.), basta con volver a grabar el paso afectado y Katalon actualiza el `.rs` correspondiente sin necesidad de tocar los scripts Groovy.

**Recomendación:** preferir `@data-test` sobre XPath de posición (`//div[2]/span[1]`) para mayor estabilidad ante cambios de layout.
