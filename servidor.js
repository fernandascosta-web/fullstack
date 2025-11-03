

const express = require('express');
const path = require('path');
var http = require('http');
var app = express();
const PORT = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurações do EJS (Template Engine) - LAB 8 (item 4.a)
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.redirect('/Project.html');
});

app.get('/login', (req, res) => {
    res.redirect('/Login.html');
});

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    let status = (usuario === 'admin' && senha === '123'); // Lógica de validação
    
    res.render('resposta', { status: status, usuario: usuario });
});

app.get('/cadastrar', (req, res) => {
    var nome = req.query.nome;
    var sobrenome = req.query.sobrenome;
    var nascimento = req.query.nascimento;
    var civil = req.query.civil;
    

    res.render('resposta_cadastro', { nome, sobrenome, nascimento, civil });
});


app.get('/cadastro', (req, res) => {
    res.redirect('/Cadastro.html');
});

app.use(express.static(path.join(__dirname, 'public')));


var server = http.createServer(app);

server.listen(PORT, () => {
    const message = `Servidor rodando em http://localhost:${PORT}`;
    try {
        require('colors'); 
        console.log(message.rainbow);
    } catch (e) {
        console.log(message);
    }
});