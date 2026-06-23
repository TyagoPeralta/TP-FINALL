// ============================================================
// E2E01 — Explorar catálogo y aplicar filtro por búsqueda
// Flujo: Home → Categoría "Hand Tools" → Buscar "Hammer"
// Tipo: Happy Path
// Verificación clave: resultado "Hammer" visible en catálogo
// ============================================================

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

// ── 1. Abrir el navegador y navegar a la home ──────────────────
WebUI.openBrowser('https://practicesoftwaretesting.com')
WebUI.waitForPageLoad(10)
WebUI.maximizeWindow()

// ── 2. Navegar a la categoría "Hand Tools" desde el menú ───────
// El menú superior tiene un enlace a /category/hand-tools
WebUI.click(findTestObject('Page_Toolshop/a_HandTools_Nav'))
WebUI.waitForPageLoad(8)

// ── 3. Verificar que la grilla de productos cargó ──────────────
// Confirmar que existe al menos un producto en la página
WebUI.verifyElementVisible(findTestObject('Page_Toolshop/div_ProductGrid'))

// ── 4. Usar el buscador de la página para filtrar por "Hammer" ──
// Escribir en el input de búsqueda
WebUI.clearText(findTestObject('Page_Toolshop/input_SearchField'))
WebUI.sendKeys(findTestObject('Page_Toolshop/input_SearchField'), 'Hammer')

// Esperar 1500ms para el debounce del input de búsqueda (Angular)
WebUI.delay(2)

// ── 5. Verificar que aparece al menos un producto con "Hammer" ──
WebUI.verifyElementVisible(findTestObject('Page_Toolshop/span_ProductName_Hammer'))

// ── 6. Cerrar el navegador ─────────────────────────────────────
WebUI.closeBrowser()
