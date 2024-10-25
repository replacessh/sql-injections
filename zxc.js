const express = require('express');
const app = express();
const port = 7000;
const { Circus, Artist, Performance, Animal, Ticket } = require('./models');
const sequelize = require('./bd');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/circus', async (req, res) => {
    const { name, location } = req.body;
    const circus = await Circus.create({ name, location });
    res.status(201).json(circus);
});

app.get('/circus', async (req, res) => {
    const circuses = await Circus.findAll();
    res.json(circuses);
});

// Получение цирка по ID с уязвимостью к SQL-инъекции
app.get('/circus/:id', async (req, res) => {
    const id = req.params.id; // Уязвимость на этом этапе
    const query = `SELECT * FROM Circuses WHERE id = ${id}`;
    
    try {
        const [circus] = await sequelize.query(query);
        res.json(circus);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
});

// Устранение уязвимости к SQL-инъекции
app.get('/circus/safe/:id', async (req, res) => {
    const id = req.params.id; // безопасный способ использования параметров
    try {
        const circus = await Circus.findByPk(id); // используем findByPk вместо SQL-запроса
        if (!circus) {
            return res.status(404).send('Цирк не найден');
        }
        res.json(circus);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/circus/:id', async (req, res) => {
    const { id } = req.params;
    const { name, location } = req.body;
    await Circus.update({ name, location }, { where: { id } });
    res.sendStatus(204);
});

app.delete('/circus/:id', async (req, res) => {
    const { id } = req.params;
    await Circus.destroy({ where: { id } });
    res.sendStatus(204);
});

app.post('/artist', async (req, res) => {
    const { name, age } = req.body;
    const artist = await Artist.create({ name, age });
    res.status(201).json(artist);
});

app.get('/artist', async (req, res) => {
    const artists = await Artist.findAll();
    res.json(artists);
});

// Получение артиста по ID с уязвимостью к SQL-инъекции
app.get('/artist/:id', async (req, res) => {
    const id = req.params.id; // Уязвимость на этом этапе
    const query = `SELECT * FROM Artists WHERE id = ${id}`;

    try {
        const [artist] = await sequelize.query(query);
        res.json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
});

// Устранение уязвимости к SQL-инъекции
app.get('/artist/safe/:id', async (req, res) => {
    const id = req.params.id; // безопасный способ использования параметров
    try {
        const artist = await Artist.findByPk(id); // используем findByPk вместо SQL-запроса
        if (!artist) {
            return res.status(404).send('Артист не найден');
        }
        res.json(artist);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/artist/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age } = req.body;
    await Artist.update({ name, age }, { where: { id } });
    res.sendStatus(204);
});

app.delete('/artist/:id', async (req, res) => {
    const { id } = req.params;
    await Artist.destroy({ where: { id } });
    res.sendStatus(204);
});

app.post('/performance', async (req, res) => {
    const { title, date, circusId } = req.body;
    
    const performance = await Performance.create({ title, date, CircusId: circusId });
    res.status(201).json(performance);
});

app.get('/performance', async (req, res) => {
    const performances = await Performance.findAll({
        include: Circus,
    });
    res.json(performances);
});

app.put('/performance/:id', async (req, res) => {
    const { id } = req.params;
    const { title, date } = req.body;
    await Performance.update({ title, date }, { where: { id } });
    res.sendStatus(204);
});

app.delete('/performance/:id', async (req, res) => {
    const { id } = req.params;
    await Performance.destroy({ where: { id } });
    res.sendStatus(204);
});

app.post('/animal', async (req, res) => {
    const { species, name, circusId } = req.body;
    const animal = await Animal.create({ species, name, CircusId: circusId });
    res.status(201).json(animal);
});

app.get('/animal', async (req, res) => {
    const animals = await Animal.findAll({
        include: Circus,
    });
    res.json(animals);
});

app.put('/animal/:id', async (req, res) => {
    const { id } = req.params;
    const { species, name } = req.body;
    await Animal.update({ species, name }, { where: { id } });
    res.sendStatus(204);
});

app.delete('/animal/:id', async (req, res) => {
    const { id } = req.params;
    await Animal.destroy({ where: { id } });
    res.sendStatus(204);
});

app.post('/ticket', async (req, res) => {
    const { price, seatNumber, performanceId } = req.body;
    const ticket = await Ticket.create({ price, seatNumber, PerformanceId: performanceId });
    res.status(201).json(ticket);
});

app.get('/ticket', async (req, res) => {
    const tickets = await Ticket.findAll({
        include: Performance,
    });
    res.json(tickets);
});

app.put('/ticket/:id', async (req, res) => {
    const { id } = req.params;
    const { price, seatNumber } = req.body;
    await Ticket.update({ price, seatNumber }, { where: { id } });
    res.sendStatus(204);
});

app.delete('/ticket/:id', async (req, res) => {
    const { id } = req.params;
    await Ticket.destroy({ where: { id } });
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
