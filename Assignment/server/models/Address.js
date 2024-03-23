module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define("Address", {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        country: {
            type: DataTypes.TEXT,
            allowNull: false
        },        
        fullAddress: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        postalCode: {
            type: DataTypes.TEXT,
            allowNull: false
        }      
    }, {
        tableName: 'addresses'
    });

    Address.associate = (models) => {
        Address.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Address;
}
