const { DataTypes } = require("sequelize");
const { database } = require("../dbSequelize");

const User = database.define('users', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El nombre de usuario es requerido'
        },
        len: {
          args: [2, 255],
          msg: 'El nombre de usuario debe tener entre 2 y 255 caracteres'
        }
      }
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'El correo electrónico es requerido'
        },
        len: {
          args: [6, 255],
          msg: 'El correo electrónico debe tener entre 6 y 255 caracteres'
        },
        isEmail: {
          msg: 'El correo electrónico es inválido'
        }
      }
    },
    userPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La contraseña es requerida'
        },
        len: {
          args: [6, 255],
          msg: 'La contraseña debe tener entre 6 y 255 caracteres'
        }
      }
    },
    createdat: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userPlan: {
        type: DataTypes.STRING,
        defaultValue: 'free'
    },
    userStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    userToken: {
        type: DataTypes.STRING
    },
    reset_token: {
      type: DataTypes.STRING,

    }
});
module.exports = User