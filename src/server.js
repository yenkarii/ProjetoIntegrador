import express from 'express';
import dotenv from 'dotenv';
import conectarBanco from './db.js';

// recuperar variáveis do .env
dotenv.config();
// criar o servidor
const app = express();
// permitir json no corpo da requisição
app.use(express.json());
// definir a pasta de arquivos estáticos (frontend)
app.use(express.static('./pages'));
// define a porta do servidor que será hosteado
const PORT = process.env.PORT;
// variável de conexão
const conn = conectarBanco();

// página inicial frontend
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "./pages"})
})


// FAZ O SERVIDOR ESCUTAR
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});https://github.com/yenkarii/ProjetoIntegrador/tree/main/ProjetoIntegrador