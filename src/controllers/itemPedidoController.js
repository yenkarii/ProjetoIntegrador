import * as itemPedidoModel from '../models/itemPedidoModel.js';

export async function listar(req, res) {
    try {
        const resp = await itemPedidoModel.listar();
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar itens de pedidos!" });
    }
}

export async function buscarPorId(req, res) {
    const id = req.id || Number(req.params.id);
    try {
        const resp = await itemPedidoModel.buscarPorId(id);
        if (!resp || resp.length === 0) {
            return res.status(404).json({ erro: "Item de pedido não encontrado!" });
        }
        return res.status(200).json(resp[0]);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar buscar item do pedido!" });
    }
}

export async function criar(req, res) {
    const { id_pedido, id_produto, quantidade, preco_unitario } = req.body ?? {};
    if (!id_pedido || !id_produto || quantidade === undefined || preco_unitario === undefined) {
        return res.status(400).json({ erro: "Informe id_pedido, id_produto, quantidade e preco_unitario!" });
    }
    try {
        const resp = await itemPedidoModel.criar({ id_pedido, id_produto, quantidade, preco_unitario });
        return res.status(201).json({
            mensagem: "Item do pedido cadastrado com sucesso!",
            id: resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar cadastrar item no pedido!" });
    }
}

export async function atualizar(req, res) {
    const id = req.id || Number(req.params.id);
    const { id_pedido, id_produto, quantidade, preco_unitario } = req.body ?? {};

    if (!id_pedido || !id_produto || quantidade === undefined || preco_unitario === undefined) {
        return res.status(400).json({ erro: "Informe id_pedido, id_produto, quantidade e preco_unitario!" });
    }
    try {
        const resp = await itemPedidoModel.atualizar(id, { id_pedido, id_produto, quantidade, preco_unitario });
        if (resp === 0) {
            return res.status(404).json({ erro: "Item de pedido não encontrado para atualizar!" });
        }
        return res.status(200).json({ mensagem: "Item do pedido atualizado com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar atualizar item do pedido!" });
    }
}

export async function deletar(req, res) {
    const id = req.id || Number(req.params.id);
    try {
        const resp = await itemPedidoModel.deletar(id);
        if (resp === 0) {
            return res.status(404).json({ erro: "Item de pedido não encontrado!" });
        }
        return res.status(200).json({ mensagem: "Item do pedido excluído com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar deletar item do pedido!" });
    }
}