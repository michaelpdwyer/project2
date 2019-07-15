module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define("Game", {
    score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Game.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Game.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Game;
};
