import * as produtoModel from '../models/produtoModel.js';

export async function listar(req, res) {
    try {
        const resp = await produtoModel.listar();

        return res.status(200).json(resp);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar todos os produtos!" });
    }
}

export async function buscarPorId(req, res) {
    const id = Number(req.params.id);
    try {
        const resp = await produtoModel.buscarPorId(id);
        if (resp.length === 0 || !resp) {
            return res.status(404).json({ erro: "Produto não encontrado ou inexistente!" });
        }
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar produto específico!" });
    }
}

export async function criar(req, res) {
    const { id_categoria, nome, preco, estoque } = req.body ?? {};
    if (!id_categoria || !nome || !preco || !estoque) {
        return res.status(400).json({ erro: "Informe id da categoria, nome do produto (até 100 caracteres), preço o e estoque para o cadastro!" });
    }
    try {
        const resp = await produtoModel.criar({ id_categoria, nome, preco, estoque });

        return res.status(201).json({
            mensagem: "Produto cadastrado com sucesso!",
            id: resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar cadastrar um produto!" });
    }
}

export async function atualizar(req, res) {
    const id = req.id || Number(req.params.id);
    const { id_categoria, nome, preco, estoque } = req.body ?? {};
    if (!id_categoria || !nome || !preco || !estoque) {
        return res.status(400).json({ erro: "Informe id da categoria, nome do produto (até 100 caracteres), preço o e estoque para o cadastro!" });
    }
    try {
        const resp = await produtoModel.atualizar(id, { id_categoria, nome, preco, estoque });

        return res.status(201).json({
            mensagem: "Produto atualizado com sucesso!",
            resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar atualizar um produto!" });
    }
}

export async function deletar(req, res) {
    const id = Number(req.params.id);
    try {
        const resp = await produtoModel.deletar(id);
        if (resp.length === 0 || !resp) {
            return res.status(404).json({ erro: "Produto não encontrado ou inexistente!" });
        }
        return res.status(201).json({ mensagem: "Cadastro de produto excluído com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar deletar o cadastro de um produto!" });
    }
}