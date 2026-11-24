import * as pedidoModel from '../models/pedidoModel.js';

export async function listar(req, res) {
    try {
        const resp = await pedidoModel.listar();
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar pedidos!" });
    }
}

export async function buscarPorId(req, res) {
    const id = req.id || Number(req.params.id);
    try {
        const resp = await pedidoModel.buscarPorId(id);
        if (!resp || resp.length === 0) {
            return res.status(404).json({ erro: "Pedido não encontrado!" });
        }
        return res.status(200).json(resp[0]);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar buscar pedido!" });
    }
}

export async function criar(req, res) {
    const { id_cliente, valor_total, status } = req.body ?? {};
    if (!id_cliente) {
        return res.status(400).json({ erro: "Informe id_cliente para cadastrar um pedido!" });
    }
    try {
        const resp = await pedidoModel.criar({ id_cliente, valor_total, status });
        return res.status(201).json({
            mensagem: "Pedido criado com sucesso!",
            id: resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar criar pedido!" });
    }
}

export async function atualizar(req, res) {
    const id = req.id || Number(req.params.id);
    const { id_cliente, valor_total, status } = req.body ?? {};

    if (!id_cliente || valor_total === undefined || !status) {
        return res.status(400).json({ erro: "Informe id_cliente, valor_total e status para a atualização!" });
    }
    try {
        const resp = await pedidoModel.atualizar(id, { id_cliente, valor_total, status });
        if (resp === 0) {
            return res.status(404).json({ erro: "Pedido não encontrado para atualizar!" });
        }
        return res.status(200).json({ mensagem: "Pedido atualizado com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar atualizar pedido!" });
    }
}

export async function deletar(req, res) {
    const id = req.id || Number(req.params.id);
    try {
        const resp = await pedidoModel.deletar(id);
        if (resp === 0) {
            return res.status(404).json({ erro: "Pedido não encontrado!" });
        }
        return res.status(200).json({ mensagem: "Pedido excluído com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar deletar pedido!" });
    }
}