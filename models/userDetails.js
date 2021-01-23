module.exports = function (sequelize, DataTypes) {
    const UserDetails = sequelize.define("UserDetails", {
      firstName: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          len: [1,30]
        }
      },
      lastName: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          len: [1,30]
        }
      },
      userName: {
        type: DataTypes.STRING,
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