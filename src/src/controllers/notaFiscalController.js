import * as notaFiscalModel from '../models/notaFiscalModel.js';

export async function listar(req, res) {
    try {
        const resp = await notaFiscalModel.listar();
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar notas fiscais!" });
    }
}

export async function buscarPorId(req, res) {
    const id = req.id || Number(req.params.id);
    try {
        const resp = await notaFiscalModel.buscarPorId(id);
        if (!resp || resp.length === 0) {
            return res.status(404).json({ erro: "Nota fiscal não encontrada!" });
        }
        return res.status(200).json(resp[0]);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar buscar nota fiscal!" });
    }
}

export async function criar(req, res) {
    const { id_pedido, numero_nota, valor_total } = req.body ?? {};
    if (!id_pedido || !numero_nota || valor_total === undefined) {
        return res.status(400).json({ erro: "Informe id_pedido, numero_nota e valor_total!" });
    }
    try {
        const resp = await notaFiscalModel.criar({ id_pedido, numero_nota, valor_total });
        return res.status(201).json({
            mensagem: "Nota fiscal emitida com sucesso!",
            id: resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar emitir nota fiscal!" });
    }
}

export async function atualizar(req, res) {
    const id = req.id || Number(req.params.id);
    const { id_pedido, numero_nota, valor_total } = req.body ?? {};

    if (!id_pedido || !numero_nota || valor_total === undefined) {
        return res.status(400).json({ erro: "Informe id_pedido, numero_nota e valor_total para atualização!" });
    }
    try {
        const resp = await notaFiscalModel.atualizar(id, { id_pedido, numero_nota, valor_total });
        if (resp === 0) {
            return res.status(404).json({ erro: "Nota fiscal não encontrada para atualizar!" });
        }
        return res.status(200).json({ mensagem: "Nota fiscal atualizada com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar atualizar nota fiscal!" });
    }
}

export async function deletar(req, res) {
    const id = req.id || Number(req.params.id);
    try {
        const resp = await notaFiscalModel.deletar(id);
        if (resp === 0) {
            return res.status(404).json({ erro: "Nota fiscal não encontrada!" });
        }
        return res.status(200).json({ mensagem: "Nota fiscal excluída com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar deletar nota fiscal!" });
    }
}