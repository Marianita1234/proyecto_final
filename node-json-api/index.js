// Librerías externas
const express = require('express');
const cors = require('cors');
const { v4: uuid_v4 } = require('uuid');

// Módulos internos
const { readFile, writeFile } = require('./src/files');

const app = express();
const FILE_NAME = './db/prendas.txt'; // Cambié el nombre del archivo
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Rutas DE PRUEBA
app.get('/hola/:name', (req, res) => {
    console.log(req);
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    res.send(`Hello ${formal ? 'Mr.' : ''} 
    ${name} ${type ? ' ' + type : ''}`);
});

app.get('/read-file', (req, res) => {
    const data = readFile(FILE_NAME);
    res.send(data);
});

// API
// Listar prendas
app.get('/prendas', (req, res) => {
    const data = readFile(FILE_NAME);
    res.json(data);
});

// Crear prenda
app.post('/prendas', (req, res) => {
    try {
        // Leer el archivo de prendas
        const data = readFile(FILE_NAME);
        // Agregar la nueva prenda (Agregar ID)
        const newPrenda = req.body;
        newPrenda.id = uuid_v4();
        console.log(newPrenda);
        data.push(newPrenda);
        // Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.json({ 'ok': true, message: 'La prenda fue creada con éxito' });
    } catch (error) {
        console.error(error);
        res.json({ 'ok': true, message: 'Error al almacenar la prenda' });
    }
});

// Obtener una sola prenda
app.get('/prendas/:id', (req, res) => {
    const id = req.params.id;
    const prendas = readFile(FILE_NAME);
    const prendaFound = prendas.find(prenda => prenda.id === id);
    if (!prendaFound) {
        res.status(404).json({ ok: false, message: "Prenda no encontrada" });
    } else {
        res.json({ ok: true, prenda: prendaFound });
    }
});

// Actualizar una prenda
app.put('/prendas/:id', (req, res) => {
    const id = req.params.id;
    const prendas = readFile(FILE_NAME);
    const prendaIndex = prendas.findIndex(prenda => prenda.id === id);
    if (prendaIndex < 0) {
        res.status(404).json({ ok: false, message: "Prenda no encontrada" });
    } else {
        let prenda = prendas[prendaIndex];
        prenda = { ...prenda, ...req.body };
        prendas[prendaIndex] = prenda;
        writeFile(FILE_NAME, prendas);
        res.json({ ok: true, prenda: prenda });
    }
});

// Eliminar una prenda
app.delete('/prendas/:id', (req, res) => {
    const id = req.params.id;
    const prendas = readFile(FILE_NAME);
    const prendaIndex = prendas.findIndex(prenda => prenda.id === id);
    if (prendaIndex < 0) {
        res.status(404).json({ ok: false, message: "Prenda no encontrada" });
    } else {
        // Eliminar la prenda que esté en la posición prendaIndex
        prendas.splice(prendaIndex, 1);
        writeFile(FILE_NAME, prendas);
        res.json({ ok: true, message: 'Prenda eliminada exitosamente' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
