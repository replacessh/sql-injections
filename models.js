const { DataTypes } = require('sequelize');
const sequelize = require('./bd')

const Circus = sequelize.define('Circus', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
const Artist = sequelize.define('Artist', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Performance = sequelize.define('Performance', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

const Animal = sequelize.define('Animal', {
  species: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Ticket = sequelize.define('Ticket', {
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  seatNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Circus.hasMany(Performance);
Performance.belongsTo(Circus);

Artist.belongsToMany(Performance, { through: 'ArtistPerformance' });
Performance.belongsToMany(Artist, { through: 'ArtistPerformance' });

Circus.hasMany(Animal);
Animal.belongsTo(Circus);

Performance.hasMany(Ticket);
Ticket.belongsTo(Performance);

module.exports = {
  Circus,
  Artist,
  Performance,
  Animal,
  Ticket,
};
