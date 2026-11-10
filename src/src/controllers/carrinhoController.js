import * as carrinhoModel from '../models/carrinhoModel.js';

export async function listar(req, res) {
    try {
        const resp = await carrinhoModel.listar();
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar itens do carrinho!" });
    }
}

export async function buscarPorId(req, res) {
    const id = req.id || Number(req.params.id);
    try {
        const resp = await carrinhoModel.buscarPorId(id);
        if (!resp || resp.length === 0) {
            return res.status(404).json({ erro: "Item do carrinho não encontrado!" });
        }
        return res.status(200).json(resp[0]);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar buscar item do carrinho!" });
    }
}

export async function criar(req, res) {
    const { id_cliente, id_produto, quantidade } = req.body ?? {};
    if (!id_cliente || !id_produto) {
        return res.status(400).json({ erro: "Informe id_cliente e id_produto obrigatoriamente!" });
    }
    try {
        const resp = await carrinhoModel.criar({ id_cliente, id_produto, quantidade });
        return res.status(201).json({
            mensagem: "Item adicionado ao carrinho com sucesso!",
            id: resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar adicionar item ao carrinho!" });
    }
}

export async function atualizar(req, res) {
    const id = req.id || Number(req.params.id);
    const { id_cliente, id_produto, quantidade } = req.body ?? {};

    if (!id_cliente || !id_produto || quantidade === undefined) {
        return res.status(400).json({ erro: "Informe id_cliente, id_produto e quantidade para a atualização!" });
    }
    try {
        const resp = await carrinhoModel.atualizar(id, { id_cliente, id_produto, quantidade });
        if (resp === 0) {
            return res.status(404).json({ erro: "Item do carrinho não encontrado para atualizar!" });
        }
        return res.status(200).json({ mensagem: "Carrinho atualizado com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar atualizar o carrinho!" });
    }
}

export async function deletar(req, res) {
    const id = req.id || Number(req.params.id);
    try {
        const resp = await carrinhoModel.deletar(id);
        if (resp === 0) {
            return res.status(404).json({ erro: "Item do carrinho não encontrado!" });
        }
        return res.status(200).json({ mensagem: "Item removido do carrinho com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar remover item do carrinho!" });
    }
}