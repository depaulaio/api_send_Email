require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'teste.html');

const app = express();
app.use(express.json());

// Configurando o Nodemailer com suas credenciais passadas em arquivo .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verifica se a conexão com o servidor de e-mails está funcionando
transporter.verify((error, success) => {
  if (error) {
    console.log('Erro na configuração do e-mail:', error);
  } else {
    console.log('Servidor de e-mails pronto para enviar mensagens');
  }
});

// Rota para enviar e-mail
app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  // Ler o arquivo HTML e enviá-lo como corpo do e-mail
  fs.readFile(htmlPath, 'utf-8', async (err, html_message) => {
    if (err) {
      console.error('Erro ao ler o arquivo HTML:', err);
      return res.status(500).json({ message: 'Erro ao ler o arquivo HTML' });
    }

    try {
      await transporter.sendMail({ //await pausa a execução da função assíncrona até que o objeto da promises seja resolvida.
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html: html_message,  // Define o HTML como corpo do e-mail
      });
      res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
      console.error('Erro ao enviar o e-mail:', error);
      res.status(500).json({ message: 'Erro ao enviar o e-mail', error });
    }
  });
});

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
