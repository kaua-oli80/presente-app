const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Rota para pegar o progresso atual
app.get('/progresso', (req, res) => {
  fs.readFile('progresso.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao ler progresso' });
    const progresso = JSON.parse(data).valor || 0;
    res.json({ valor: progresso });
  });
});

// Rota para atualizar o progresso
app.post('/progresso', (req, res) => {
  const { valor } = req.body;
  if (valor < 0 || valor > 100) return res.status(400).json({ erro: 'Valor inválido' });

  fs.writeFile('progresso.json', JSON.stringify({ valor }), err => {
    if (err) return res.status(500).json({ erro: 'Erro ao salvar progresso' });
    res.json({ sucesso: true });
  });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
