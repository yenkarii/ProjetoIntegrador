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
    res.sendFile("index.html", { root: "./pages" })
})

// -------- ROTAS ----------

// ----------------------------
// ######## CADASTROS #########
// ----------------------------

// ROTA PARA LISTAR TODOS OS CADASTROS

app.get('/cadastros', async (req, res) => {
    const sql = 'SELECT * FROM cadastro';
    try {
        const [resp] = await conn.query(sql);
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao retornar todos os cadastros!" });
    }
});

// ROTA PARA LISTAR APENAS UM CADASTRO VIA ID

app.get('/cadastros/:id', async (req, res) => {
    const id = Number(req.params.id);
    const sql = 'SELECT * FROM cadastro WHERE id_cadastro = ?'
    try {
        const [resp] = await conn.query(sql, [id]);
        if (resp.length === 0) {
            return res.status(404).json({ erro: "Cadastro não encontrado ou inexistente!" });
        }
        return res.status(201).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({erro: "Erro interno ao tentar encontrar cadastro específico!"});
    }
});

// ROTA PARA REALIZAR UM CADASTRO
// ---
/* Relações:
    criar cliente: nome, email senha
    -- id_cliente
    criar cadastro
    -- conectar id_cliente local com o id_cliente estrangeiro
    criar login
    -- conectar id_cliente local com o id_cliente estrangeiro
    -- conectar usuario (email) e senha locais com email e senha estrangeiros
*/
// ---

app.post('/cadastros', async (req, res) => {
    const {nome, email, senha} = req.body;
    if(!nome || !email || !senha) {
        return res.status(400).json({erro: "Informe nome, email e senha para o cadastro!"});
    }
    try {
    const sqlCliente = 'INSERT INTO cliente (nome, email, senha) VALUES (?, ?, ?)'
    const [respCliente] = await conn.query(sqlCliente, [nome, email, senha]);
    const idRetornado = respCliente.insertId;

    const sqlCadastro = 'INSERT INTO cadastro (id_cliente) VALUES (?)';
    await conn.query(sqlCadastro, [idRetornado]);

    const sqlLogin = 'INSERT INTO login (id_cliente, usuario, senha) VALUES (?, ?, ?)';
    await conn.query(sqlLogin, [idRetornado, email, senha]);

    return res.status(201).json({mensagem: "Cadastro realizado com sucesso!",
        id: respCliente.insertId
    }); // pfv funciona se não eu me MATO

    } catch (erro) {
        console.error(erro);
        return res.status(500).json({erro: "Erro interno ao tentar realizar cadastro!"});
    }
});

// FAZ O SERVIDOR ESCUTAR
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});