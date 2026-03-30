const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Configuración de SQLite (PostgreSQL Lite local)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'database.sqlite'),
  logging: false,
});

// Modelo de Streamer
const Streamer = sequelize.define('Streamer', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  cloudflare_uid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stream_key: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Sincronización automática
sequelize.sync({ alter: true });

module.exports = { sequelize, Streamer };
