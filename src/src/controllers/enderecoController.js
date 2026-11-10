import * as enderecoModel from '../models/enderecoModel.js';

export async function listar(req, res) {
    try {
        const resp = await enderecoModel.listar();

        return res.status(200).json(resp);
    } catch (erro) {
        console.log(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar todos os endereços!" });
    }
}

export async function buscarPorId(req, res) {
    const id = Number(req.params.id);
    try {
        const resp = await enderecoModel.buscarPorId(id);
        if (resp.length === 0 || !resp) {
            return res.status(404).json({ erro: "Endereço não encontrado ou inexistente!" });
        }
        return res.status(200).json(resp);
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar listar endereço específico!" });
    }
}

export async function criar(req, res) {
    const { id_cliente, rua, numero, cidade, cep } = req.body ?? {};
    if (!id_cliente || !rua || !numero || !cidade || !cep) {
        return res.status(400).json({ erro: "Informe ID do cliente, rua (até 150 caracteres), número da residência (até 20 número), nome da cidade (até 50 caracteres) e CEP (até 10 caracteres) para o cadastro!" });
    }
    try {
        const resp = await enderecoModel.criar({ id_cliente, rua, numero, cidade, cep });

        return res.status(201).json({
            mensagem: "Endereço cadastrado com sucesso!",
            id: resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar cadastrar um endereço!" });
    }
}

export async function atualizar(req, res) {
    const id = req.id || Number(req.params.id);
    const { id_cliente, rua, numero, cidade, cep } = req.body ?? {};
    if (!id_cliente || !rua || !numero || !cidade || !cep) {
        return res.status(400).json({ erro: "Informe ID do cliente, rua (até 150 caracteres), número da residência (até 20 número), nome da cidade (até 50 caracteres) e CEP (até 10 caracteres) para a atualização!" });
    }
    try {
        const resp = await enderecoModel.atualizar(id, { id_cliente, rua, numero, cidade, cep });

        return res.status(201).json({
            mensagem: "Endereço atualizado com sucesso!",
            resp
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar atualizar um endereço!" });
    }
}

export async function deletar(req, res) {
    const id = Number(req.params.id);
    try {
        const resp = await enderecoModel.deletar(id);
        if (resp.length === 0 || !resp) {
            return res.status(404).json({ erro: "Endereço não encontrado ou inexistente!" });
        }
        return res.status(201).json({ mensagem: "Cadastro de endereço excluído com sucesso!" });
    } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: "Erro interno ao tentar deletar o cadastro de um endereço!" });
    }
}