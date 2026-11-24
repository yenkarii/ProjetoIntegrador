import * as categoriaModel from '../models/categoriaModel.js';

export async function listar(req, res) {
    try {
        const resp = await categoriaModel.listar();

        return res.status(200).json(resp);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar todos os categorias!" });
    }
}

export async function buscarPorId(req, res) {
    const id = Number(req.params.id);
    try {
        const resp = await categoriaModel.buscarPorId(id);
        if (resp.length === 0 || !resp) {
            return res.status(404).json({ erro: "Categoria não encontrado ou inexistente!" });
        }
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar categoria específico!" });
    }
}

export async function criar(req, res) {
    const { nome } = req.body ?? {};
    if (!nome) {
        return res.status(400).json({ erro: "Informe nome (até 50 caracteres) para o cadastro!" });
    }
    try {
        const resp = await categoriaModel.criar({ nome });

        return res.status(201).json({
            mensagem: "Categoria cadastrado com sucesso!",
            id: resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar cadastrar uma categoria!" });
    }
}

export async function atualizar(req, res) {
    const id = req.id || Number(req.params.id);
    const { nome } = req.body ?? {};
    if (!nome) {
        return res.status(400).json({ erro: "Informe nome (até 50 caracteres) para a atualização!"});
    }
    try {
        const resp = await categoriaModel.atualizar(id, { nome });

        return res.status(201).json({
            mensagem: "Categoria atualizado com sucesso!",
            resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar atualizar uma categoria!" });
    }
}

export async function deletar(req, res) {
    const id = Number(req.params.id);
    try {
        const resp = await categoriaModel.deletar(id);
        if (resp.length === 0 || !resp) {
            return res.status(404).json({ erro: "Categoria não encontrado ou inexistente!" });
        }
        return res.status(201).json({mensagem: "Cadastro de categoria excluído com sucesso!"});
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({erro: "Erro interno ao tentar deletar o cadastro de uma categoria!"});
    }
}