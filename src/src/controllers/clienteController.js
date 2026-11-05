import conn from '../../db';
import * as clienteModel from '../models/clienteModel.js';

export async function listar(req, res) {
    try {
        const resp = await clienteModel.listar();

        return res.status(200).json(resp);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar todos os clientes!" });
    }
}

export async function buscarPorId(req, res) {
    const id = Number(req.params.id);
    try {
        const resp = await clienteModel.buscarPorId(id);
        if (resp.length === 0 || !resp) {
            return res.status(404).json({ erro: "Cliente não encontrado ou inexistente!" });
        }
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar cliente específico!" });
    }
}

export async function criar(req, res) {
    const { nome, email, senha } = req.body ?? {};
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Infome nome (até 100 characteres), email (até 100 caracteres) e senha (até 255 caracteres) para o cadastro!" });
    }
    try {
        const resp = await clienteModel.criar({ nome, email, senha });

        return res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso!",
            id: resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar cadastrar um cliente!" });
    }
}

export async function atualizar(req, res) {
    const { nome, email, senha } = req.body ?? {};
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Infome nome (até 100 characteres), email (até 100 caracteres) e senha (até 255 caracteres) para o cadastro!" });
    }
    try {
        const resp = await clienteModel.atualizar({ nome, email, senha });

        return res.status(201).json({
            mensagem: "Cliente atualizado com sucesso!",
            resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar cadastrar um cliente!" });
    }
}

export async function deletar(req, res) {
    const id = Number(req.params.id);
    try {
        const resp = await clienteModel.deletar(id);
        if (resp.length === 0 || !resp) {
            return res.status(404).json({ erro: "Cliente não encontrado ou inexistente!" });
        }
        return res.status(201).json({mensagem: "Cadastro de cliente excluído com sucesso!"});
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({erro: "Erro interno ao tentar deletar o cadastro de um cliente!"});
    }
}