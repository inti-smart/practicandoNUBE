# 💧 Hidratador - Recordatorio de Agua

Una aplicación web progresiva (PWA) simple pero poderosa para ayudarte a mantener una hidratación saludable durante el día.

## 🌟 Características

### Funcionalidades Principales
- ✅ **Contador de vasos diario** - Lleva un registro de cuánta agua has tomado
- ✅ **Seguimiento en litros** - Visualiza tu consumo en mililitros y litros
- ✅ **Barra de progreso** - Ve tu avance hacia tu meta diaria
- ✅ **Notificaciones inteligentes** - Recordatorios automáticos para que no olvides hidratarte
- ✅ **Historial del día** - Revisa todos tus registros con hora exacta
- ✅ **Configuración personalizada** - Ajusta la app a tus necesidades

### Características Técnicas
- 📱 **PWA (Progressive Web App)** - Instalable en tu teléfono como una app nativa
- 🔔 **Notificaciones push** - Funciona incluso cuando cierras el navegador
- 💾 **Almacenamiento local** - Tus datos se guardan en tu dispositivo
- 🌐 **Funciona offline** - No necesitas internet después de la primera carga
- 🎨 **Diseño moderno** - Interfaz limpia y atractiva
- 📊 **Auto-reset diario** - El contador se reinicia automáticamente a medianoche

## 🚀 Cómo usar

### Instalación Rápida

1. **Opción 1: Abrir directamente**
   - Simplemente abre el archivo `index.html` en tu navegador
   - ¡Listo! Ya puedes usar la app

2. **Opción 2: Servidor local (recomendado para PWA)**
   ```bash
   # Con Python 3
   python3 -m http.server 8000

   # Con Node.js
   npx http-server

   # Con PHP
   php -S localhost:8000
   ```
   - Luego abre `http://localhost:8000` en tu navegador

3. **Opción 3: Instalar en tu móvil**
   - Abre la app en tu navegador móvil (Chrome, Safari, etc.)
   - Busca la opción "Agregar a pantalla de inicio"
   - ¡Ahora tienes una app nativa!

### Uso Diario

1. **Registra tu agua**
   - Presiona el botón grande "Tomé un vaso" cada vez que bebas agua
   - O usa "Cantidad personalizada" si bebiste más o menos

2. **Configura tus preferencias**
   - **Meta diaria**: Cuántos vasos quieres tomar (default: 8 vasos)
   - **Tamaño del vaso**: Mililitros por vaso (default: 250ml)
   - **Recordatorios**: Cada cuántos minutos quieres que te recuerde (default: 60 min)

3. **Activa las notificaciones**
   - La primera vez que uses la app, acepta las notificaciones
   - Recibirás recordatorios amigables para que bebas agua

## 📱 Capturas de Pantalla

La aplicación incluye:
- Dashboard con estadísticas en tiempo real
- Barra de progreso visual
- Historial detallado de hoy
- Panel de configuración completo
- Frases motivacionales

## 🎯 ¿Por qué usar Hidratador?

### Beneficios de mantenerse hidratado:
- 💪 Mejora tu energía y concentración
- 🧠 Optimiza tu función cerebral
- 🏃 Mejora tu rendimiento físico
- ✨ Piel más saludable
- 🩺 Apoya la función de tus órganos
- 🔥 Ayuda con el metabolismo

### Datos importantes:
- 75% de las personas están crónicamente deshidratadas
- Se recomienda beber 8 vasos (2 litros) de agua al día
- Muchas personas confunden sed con hambre
- La deshidratación puede afectar tu estado de ánimo

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno con animaciones
- **JavaScript (Vanilla)** - Sin dependencias, puro y rápido
- **Service Workers** - Para funcionalidad offline
- **Web Notifications API** - Para recordatorios
- **LocalStorage API** - Para persistencia de datos
- **PWA Manifest** - Para instalación en dispositivos

## 📂 Estructura del Proyecto

```
hidratador/
│
├── index.html          # Página principal
├── styles.css          # Estilos modernos
├── app.js              # Lógica de la aplicación
├── sw.js               # Service Worker para PWA
├── manifest.json       # Configuración PWA
├── icon.svg            # Icono de la app
├── icon.png            # Icono para navegadores
├── icon-192.png        # Icono PWA 192x192
├── icon-512.png        # Icono PWA 512x512
└── README.md           # Este archivo
```

## ⚙️ Configuración Avanzada

### Personalización de notificaciones
Edita en `app.js` para cambiar:
- Mensajes de notificación
- Frases motivacionales
- Intervalos de recordatorios

### Temas y colores
Edita en `styles.css` las variables CSS:
```css
:root {
    --primary-color: #4A90E2;
    --secondary-color: #67B8E3;
    /* ... más colores */
}
```

## 🔒 Privacidad

- ✅ **100% local** - Todos tus datos se guardan solo en tu dispositivo
- ✅ **Sin servidores** - No enviamos nada a ningún servidor
- ✅ **Sin tracking** - No rastreamos tu actividad
- ✅ **Sin anuncios** - Aplicación completamente gratuita
- ✅ **Open source** - Código completamente visible

## 🐛 Solución de Problemas

### Las notificaciones no funcionan
- Asegúrate de haber aceptado los permisos de notificaciones
- Revisa la configuración de notificaciones de tu navegador
- En móviles, verifica que el navegador tenga permisos

### Los datos se borran
- Verifica que no estés en modo incógnito
- Revisa que no tengas activada la limpieza automática de datos
- Asegúrate de no limpiar el localStorage manualmente

### La app no se instala
- Usa HTTPS o localhost (las PWA lo requieren)
- Asegúrate de que el manifest.json sea accesible
- Verifica que los iconos existan

## 🤝 Contribuciones

¿Tienes ideas para mejorar la app? ¡Genial! Algunas ideas:
- Gráficos de progreso semanal
- Integración con smartwatches
- Recordatorios más inteligentes basados en actividad
- Temas de color personalizables
- Estadísticas históricas

## 📄 Licencia

Este proyecto es de código abierto y gratuito para uso personal y comercial.

## 👨‍💻 Autor

Creado con 💙 por Claude Code

---

## 🎉 ¡Comienza Ahora!

No esperes más. Abre `index.html` y empieza a cuidar tu salud con **Hidratador**.

**Recuerda:** El agua es vida. Tu cuerpo te lo agradecerá. 💧

---

### Próximas mejoras planeadas:
- [ ] Modo oscuro
- [ ] Integración con Apple Health y Google Fit
- [ ] Desafíos y logros
- [ ] Recordatorios basados en clima y actividad
- [ ] Soporte multi-idioma
- [ ] Exportar datos a CSV

**Versión:** 1.0.0
**Última actualización:** Noviembre 2025
