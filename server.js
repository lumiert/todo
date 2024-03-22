const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const app = express();
const port = 80;

// Conexão com o MongoDB
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'htdocs')));


async function connectMongo() {
    try {
        await client.connect();
        console.log('Conexão com o MongoDB estabelecida');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
    }
}
connectMongo();

app.get('/', (req, res) => {
    try {
        res.redirect('/login');
    } catch(err) {
        console.log(err);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/login', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, './htdocs/login/login.html'));
    } catch(err) {
        console.error('Erro de rota: login. Erro: ', err);
        res.status(500).send('Erro interno do servidor');
    }
});

app.get('/racs', async (req, res) => {
    try {
        const database = client.db('RACS');
        const collection = database.collection('RACS');
        
        const racs = await collection.find({}).toArray();
        
        res.sendFile(path.join(__dirname, './htdocs/racs.html'));
        
    } catch (err) {
        console.error('Erro ao obter dados dos racs:', err);
        res.status(500).send('Erro ao obter dados dos racs');
    }
});

app.get('/racs-json', async (req, res) => {
    try {
        const database = client.db('RACS');
        const collection = database.collection('RACS');
        
        const racs = await collection.find({}).toArray();
        
        res.json(racs);
    } catch (err) {
        console.error('Erro ao obter dados dos racs:', err);
        res.status(500).send('Erro ao obter dados dos racs');
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});