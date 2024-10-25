const {Sequelize} = require('sequelize');
module.exports = new Sequelize(
'cirk',
'postgres',
'1',
{
    dialect:'postgres'
}

);
