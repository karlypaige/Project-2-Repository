module.exports = function (sequelize, DataTypes) {
    const UserDetails = sequelize.define("UserDetails", {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [1,30]
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [1,30]
        }
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [1,30]
        }
      }
    });
    UserDetails.associate = function (models) {
        // Associating UserDetails with User
        UserDetails.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };

    return UserDetails;
};