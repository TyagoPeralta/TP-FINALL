// ============================================================
// E2E03 — Login con contraseña incorrecta (Edge Path)
// Flujo: /auth/login → credenciales inválidas → mensaje de error
// Tipo: Edge Path
// Verificación clave: div de error visible en el DOM
// ============================================================

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

// ── 1. Abrir la página de login ────────────────────────────────
WebUI.openBrowser('https://practicesoftwaretesting.com/auth/login')
WebUI.waitForPageLoad(10)
WebUI.maximizeWindow()

// ── 2. Ingresar el email válido ────────────────────────────────
WebUI.verifyElementVisible(findTestObject('Page_Toolshop/input_Email'))
WebUI.clearText(findTestObject('Page_Toolshop/input_Email'))
WebUI.setText(findTestObject('Page_Toolshop/input_Email'), 'customer@practicesoftwaretesting.com')

// ── 3. Ingresar una contraseña INCORRECTA ─────────────────────
WebUI.clearText(findTestObject('Page_Toolshop/input_Password'))
WebUI.setText(findTestObject('Page_Toolshop/input_Password'), 'contraseniaIncorrecta999')

// ── 4. Hacer clic en el botón de login ────────────────────────
WebUI.click(findTestObject('Page_Toolshop/button_SignIn'))

// ── 5. Esperar a que Angular reciba el 401 y renderice el error ─
// Angular hace POST a la API → recibe 401 Unauthorized →
// actualiza el componente en el DOM → aparece el div de error.
// Sin este delay, Katalon busca el elemento antes de que exista.
WebUI.delay(2)

// ── 6. Verificar que el mensaje de error es visible ────────────
// El componente de Angular muestra un alert con el mensaje
// "Invalid email or password." cuando el login falla.
WebUI.verifyElementVisible(findTestObject('Page_Toolshop/div_AlertDanger'))

// ── 7. Verificar el texto del mensaje de error ─────────────────
// Confirmamos que el texto del error es el esperado
WebUI.verifyElementText(
    findTestObject('Page_Toolshop/div_AlertDanger'),
    'Invalid email or password.'
)

// ── 8. Verificar que NO se redirigió al perfil ─────────────────
// El usuario debe seguir en la URL de login
String urlActual = WebUI.getUrl()
WebUI.verifyMatch(urlActual, '.*auth/login.*', true)

// ── 9. Cerrar el navegador ─────────────────────────────────────
WebUI.closeBrowser()
