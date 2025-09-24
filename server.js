const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000; // Render usa PORT do ambiente

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve arquivos da pasta public

// Rota para pegar o progresso atual
app.get('/progresso', (req, res) => {
  fs.readFile(path.join(__dirname, 'progresso.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ erro: 'Erro ao ler progresso' });
    const progresso = JSON.parse(data).valor || 0;
    res.json({ valor: progresso });
  });
});

// Rota para atualizar o progresso
app.post('/progresso', (req, res) => {
  const { valor } = req.body;
  if (valor < 0 || valor > 100) return res.status(400).json({ erro: 'Valor inválido' });

  fs.writeFile(path.join(__dirname, 'progresso.json'), JSON.stringify({ valor }), err => {
    if (err) return res.status(500).json({ erro: 'Erro ao salvar progresso' });
    res.json({ sucesso: true });
  });
});

// Rota raiz para garantir que index.html seja servido
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
