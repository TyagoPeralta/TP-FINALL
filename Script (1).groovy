// ============================================================
// E2E02 — Login exitoso y acceso al perfil de usuario
// Flujo: /auth/login → ingresar credenciales válidas → My Account
// Tipo: Happy Path
// Verificación clave: encabezado "My account" visible en la UI
// Credenciales: usuario de prueba público de Toolshop
// ============================================================

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

// ── 1. Abrir la página de login directamente ───────────────────
WebUI.openBrowser('https://practicesoftwaretesting.com/auth/login')
WebUI.waitForPageLoad(10)
WebUI.maximizeWindow()

// ── 2. Ingresar el email en el campo correspondiente ───────────
WebUI.verifyElementVisible(findTestObject('Page_Toolshop/input_Email'))
WebUI.clearText(findTestObject('Page_Toolshop/input_Email'))
WebUI.setText(findTestObject('Page_Toolshop/input_Email'), 'customer@practicesoftwaretesting.com')

// ── 3. Ingresar la contraseña ──────────────────────────────────
WebUI.clearText(findTestObject('Page_Toolshop/input_Password'))
WebUI.setText(findTestObject('Page_Toolshop/input_Password'), 'welcome01')

// ── 4. Hacer clic en el botón de login ────────────────────────
WebUI.click(findTestObject('Page_Toolshop/button_SignIn'))

// ── 5. Esperar a que Angular procese la respuesta y redirija ───
// El login hace POST a la API, recibe el JWT y redirige al perfil
WebUI.waitForPageLoad(10)

// ── 6. Verificar que el usuario llegó a su cuenta ─────────────
// La página de perfil muestra un encabezado "My account"
WebUI.verifyElementVisible(findTestObject('Page_Toolshop/h1_MyAccount'))

// ── 7. Verificar que el menú muestra el nombre del usuario ─────
// El navbar pasa a mostrar el email o nombre del usuario logueado
WebUI.verifyElementVisible(findTestObject('Page_Toolshop/span_UserMenuLoggedIn'))

// ── 8. Cerrar el navegador ─────────────────────────────────────
WebUI.closeBrowser()
