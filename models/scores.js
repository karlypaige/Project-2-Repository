module.exports = function(sequelize, DataTypes) {
  var Scores = sequelize.define("Scores", {
    // Giving the Author model a name of type STRING
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });

  Scores.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Scores.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Scores;
};