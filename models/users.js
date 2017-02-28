/**
 * Created by smile on 27.02.17.
 */

const bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10);
module.exports =  (sequelize, DataTypes)=> {

    let users = sequelize.define('users', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4, 255]
            }
        },
        name: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {

            },
            isPassword: (password, cryptedPass) => {
                return bcrypt.compareSync(password, cryptedPass);
            }
        },
        indexes: [
            {
                fields: ['email']
            }
        ]
    });

    users.hook('beforeCreate', user=>{
        user.password = bcrypt.hashSync(user.password, salt)
    });
    users.hook('beforeUpdate', (user)=>{
        if (user.password != null) {
            user.password = bcrypt.hashSync(user.password, salt);
        }
    });

    return users;
};