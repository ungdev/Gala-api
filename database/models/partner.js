module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define("Partner", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Partner.associate = models => {
    models.Event.belongsTo(Partner);
    Partner.hasMany(models.Event);
  };
  return Partner;
};
