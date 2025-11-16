const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/* ---------------------------------------
   FILE MODEL
---------------------------------------- */
const File = sequelize.define(
  "File",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    fileType: {
      type: DataTypes.STRING,
      defaultValue: "unknown",
    },

    fileSize: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },

    uploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    // REQUIRED foreign key column
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "files",
  }
);

/* ---------------------------------------
   USER MODEL
---------------------------------------- */
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 255],
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },

    role: {
      type: DataTypes.ENUM('student', 'teacher'),
      allowNull: false,
      defaultValue: 'student',
      validate: {
        isIn: [['student', 'teacher']],
      },
    },
  },
  {
    timestamps: true,
    tableName: "users",
    hooks: {
      beforeCreate: (user) => {
        user.email = user.email.toLowerCase();
      },
      beforeUpdate: (user) => {
        user.email = user.email.toLowerCase();
      },
    },
    indexes: [
      { unique: true, fields: ["email"] },
      { fields: ["username"] },
    ],
  }
);

/* ---------------------------------------
   ASSOCIATIONS
---------------------------------------- */
User.hasMany(File, {
  as: "files",
  foreignKey: "userId",
  onDelete: "CASCADE",
});

File.belongsTo(User, {
  foreignKey: "userId",
});

module.exports = { User, File, sequelize };