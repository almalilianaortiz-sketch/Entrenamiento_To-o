# Entrenamiento de Toño

Aplicación estática en `index.html`. No requiere compilación ni servidor de datos.

## Versión estable propuesta

- Series y notas, ejercicios completados y nutrición se guardan por fecha local.
- La primera apertura migra las marcas anteriores al día actual, ya que la versión anterior no guardaba fechas. Los récords y las mediciones conservan sus claves existentes.
- El reinicio del día desmarca los ejercicios tras confirmar y conserva las series.
- El temporizador utiliza una hora de finalización, sobrevive a recargas y permite pausa y reinicio. Al regresar del segundo plano muestra el tiempo real restante. El aviso con la página cerrada o suspendida depende del navegador.
- El navegador muestra un aviso cuando no puede guardar. Los datos permanecen en ese navegador y dispositivo.

## Validación

Node 24: `npm install`, `npm test`, `npx playwright install chromium`, `npm run test:browser`.

Las pruebas funcionales cubren navegación, guardado, cambio de fecha, migración, mediciones, nutrición, récords, temporizador y almacenamiento dañado o bloqueado. La prueba Chromium comprueba esos flujos y desbordamiento horizontal a 320, 390 y 768 px. GitHub Actions ejecuta ambas.

La página de producción consultada respondió HTTP 200 y coincidía con el HTML del commit c7d203ad. Las correcciones deben desplegarse antes de comprobar su interacción en producción. Las pruebas funcionales pasaron localmente; la descarga de Chromium falló en el entorno de revisión, por lo que la verificación visual queda pendiente de CI y del despliegue.
