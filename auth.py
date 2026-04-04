from flask import Flask, request, jsonify
import sqlite3
import secrets
import os

app = Flask(__name__)
DB_PATH = '/home/cristofer/usuarios.db'
SISTEMA_KEY = 'chill_secret_token_2026'

@app.route('/auth', methods=['POST'])
def auth():
    # nginx-rtmp module sends form data (name and key)
    # The key is usually sent as 'key' in the form data if configured in OBS
    # name is the stream name
    name = request.form.get('name')
    key = request.form.get('key')
    
    if not name or not key:
        return "Forbidden (Missing data)", 403
        
    try:
        # Usando 'with' para asegurar el cierre automático y timeout=30 para evitar bloqueos
        with sqlite3.connect(DB_PATH, timeout=30) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT estado FROM usuarios WHERE nombre=? AND llave=?", (name, key))
            user = cursor.fetchone()
        
        if user and user[0] == 'activo':
            return "OK", 200
        else:
            return "Forbidden (Invalid credentials)", 403
    except Exception as e:
        return str(e), 500

@app.route('/crear', methods=['POST'])
def crear():
    # Header security check
    if request.headers.get('X-System-Key') != SISTEMA_KEY:
        return jsonify({"error": "Unauthorized"}), 401
        
    data = request.get_json()
    if not data or 'username' not in data:
        return jsonify({"error": "Missing username"}), 400
        
    username = data['username']
    # Generate a secure key
    new_key = secrets.token_hex(16)
    
    try:
        with sqlite3.connect(DB_PATH, timeout=30) as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO usuarios (nombre, llave, estado) VALUES (?, ?, 'activo')", (username, new_key))
            conn.commit()
            
        return jsonify({
            "username": username, 
            "key": new_key, 
            "status": "created",
            "message": f"Usuario {username} creado exitosamente."
        }), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": f"El usuario '{username}' ya existe."}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Running on 0.0.0.0 to listen on all interfaces
    app.run(host='0.0.0.0', port=5000)
