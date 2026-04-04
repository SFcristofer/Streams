# MAPA TÉCNICO DEL SERVIDOR PENTIUM (CHILLSTREAM)

## 🌐 Información de Red
- **IP Local:** 192.168.100.24
- **Usuario SSH:** cristofer
- **Password:** faker1

## 🛠️ Especificaciones del Sistema
- **OS:** Debian 13 (Trixie)
- **CPU:** Intel Celeron 900 @ 2.20GHz (1 núcleo)
- **RAM:** 5.7 GB (5.4 GB libres)

## 📂 Configuración de Nginx (Streaming)
- **Archivo de Configuración REAL:** `/etc/nginx.conf`
  - **Directiva Seguridad:** `on_publish http://127.0.0.1:5000/auth;`
  - **Ruta HLS:** `/var/www/html/stream/hls/$name`
  - **Puerto RTMP:** 1935
  - **Puerto HTTP Video:** 80 (en /etc/nginx.conf) / 8080 (en /etc/nginx/nginx.conf)
- **Estado Actual:** Nginx está cargando `/etc/nginx/nginx.conf` por error, ignorando la configuración profesional.

## 🔐 Sistema de Autenticación (Flask)
- **Ubicación:** `/home/cristofer/auth.py`
- **Puerto:** 5000
- **Base de Datos:** `/home/cristofer/usuarios.db`
  - **Tabla:** `usuarios` (id, nombre, llave, estado)
  - **Credenciales OBS:** `cristofer` / `pro_key_99`
- **Entorno Virtual:** `/home/cristofer/gemini-env` (Python 3.13)
- **Estado Actual:** APAGADO.

## 📋 Tareas Pendientes para Funcionalidad Total (Twitch Mode)
1.  Sincronizar `/etc/nginx.conf` con la configuración activa de Nginx.
2.  Crear directorio `/var/www/html/stream/hls`.
3.  Lanzar `auth.py` como servicio persistente.
4.  Verificar que OBS pida contraseña correctamente.
