import "dotenv/config";
import express from 'express';
import cors from "cors";
import conn from './db.js';

import {textoValido} from "./src/utils/validacoes.js";
import { validarId } from "./src/middlewares/validarId.js";

import clienteRoutes from "./src/routes/clienteRoute.js";
import enderecoRoutes from "./src/routes/enderecoRoute.js";
import categoriaRoutes from './src/routes/categoriaRoute.js'
import produtoRoutes from './src/routes/produtoRoute.js';
import carrinhoRoutes from './src/routes/carrinhoRoute.js';
import pedidoRoutes from './src/routes/pedidoRoute.js';
import itemPedidoRoutes from './src/routes/itemPedidoRoute.js';
import notaFiscalRoutes from './src/routes/notaFiscalRoute.js';

import { tratarErro } from "./src/middlewares/tratarErro.js";

// criar o servidor
const app = express();
// validação do cors
app.use(cors());
// permitir json no corpo da requisição
app.use(express.json());
// definir a pasta de arquivos estáticos (frontend)
app.use(express.static('./pages'));
// define a porta do servidor que será hosteado
const PORT = Number(process.env.PORT || 3000);
// variável de conexão

// página inicial frontend
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "./pages" })
})

// -------- ROTAS ----------

app.use('/clientes/', clienteRoutes);
app.use('/enderecos/', enderecoRoutes);
app.use('/categorias/', categoriaRoutes);
app.use('/produtos/', produtoRoutes);
app.use('/carrinho/', carrinhoRoutes);
app.use('/pedidos/', pedidoRoutes);
app.use('/itempedido/', itemPedidoRoutes);
app.use('/notafiscal/', notaFiscalRoutes);

// ------- FIM DAS ROTAS ----------------

app.use((req, res) => {
    res.status(404).json({erro: "Rota não encontrada"});
});
app.use(tratarErro);

conn.connect((erro) => {
    if(erro) {
        console.error("Erro ao conectar ao banco: ", erro.code || erro.message);
        process.exit(1);
    }
    console.log("Conectado ao banco projeto_integrador");
    const servidor = app.listen(PORT, () => {
        console.log(`Servidor iniciado em http://localhost:${PORT}`);
    });
    servidor.on("error", (erro) => {
        console.error("Erro ao iniciar o servidor: ", erro.code || erro.message);
        conn.end(() => process.exit(1));
    });
});
