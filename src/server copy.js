import express from 'express';
import dotenv from 'dotenv';
import conn from './db.js';

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
    res.sendFile("index.html", { root: "./pages" })
})

// -------- ROTAS ----------


// ---------------------------
// ######## CLIENTES #########
// ---------------------------
// ROTA PARA LISTAR TODOS OS CLIENTE

app.get('/clientes', async (req, res) => {
    const sql = 'SELECT * FROM cliente';
    try {
        const [resp] = await conn.query(sql);
        if(resp.length === 0)
        {
            return res.status(404).json({erro: "Clientes não encontrados ou não há nenhum cliente cadastrado no momento!"});
        }
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao tentar listar todos os clientes!" });
    }
});


// ROTA PARA LISTAR APENAS UM CLIENTE VIA ID
app.get('/clientes/:id', async (req, res) => {
    const id = Number(req.params.id);
    const sql = 'SELECT * FROM cliente WHERE id_cliente = ?';
    try {
        const [resp] = await conn.query(sql, [id]);
        if (resp.length === 0) {
            return res.status(404).json({ erro: "Cliente não encontrado ou inexistente!" });
        }
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro ao tentar listar um cliente específico!" })
    }
});

// ROTA PARA CADASTRAR UM CLIENTE
app.post('/clientes', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Informe nome, email e senha para o cadastro!" });
    }
    const sql = 'INSERT INTO cliente (nome, email, senha) VALUES (?, ?, ?)';
    try {
        const [resp] = await conn.query(sql, [nome, email, senha]);
        return res.status(201).json({mensagem: "Usuário cadastrado com sucesso!",
            resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({erro: "Erro interno ao tentar cadastrar um usuário!"});
    }
})

// ROTA PARA ATUALIZAR UM CLIENTE
app.put('/clientes/:id', async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Informe nome, email e senha para atualizar informações!" });
    }
    const sql = 'UPDATE cliente SET nome = ?, email = ?, senha = ?';
    try{
        const [resp] = await conn.query(sql, [nome, email, senha]);
        return res.status(201).json({mensagem: "Usuário atualizado com sucesso!",
            resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({erro: "Erro ao tentar atualizar um usuário!"});
    }
});

// ROTA PARA EXCLUIR UM CLIENTE DO BANCO DE DADOS
app.delete('/clientes/:id', async (req, res) => {
    const id = Number(req.params.id);
    const sql = 'DELETE FROM cliente WHERE id_cliente = ?'
    try{
        const [resp] = await conn.query(sql, [id]);
        return res.status(201).json({mensagem: "Usuário excluido com sucesso!",
            resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({erro: "Erro interno ao tentar excluir um usuário!"});
    }
});

// ---------------------------
// ######## PRODUTOS #########
// ---------------------------
// ROTA PARA LISTAR TODOS OS PRODUTOS
app.get('/produtos', async (req, res) => {
    const sql = 'SELECT * FROM produto';
    try{
        const [resp] = await conn.query(sql);
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({erro: "Erro interno ao tentar listar todos os produtos!"});
    }
});
// FAZ O SERVIDOR ESCUTAR
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});