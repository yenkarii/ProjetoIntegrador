export function tratarErro(erro, req, res, next) {
    if (res.headersSent) return next(erro);

    // 1. JSON quebrado enviado no req.body
    if (erro.type === "entity.parse.failed") {
        return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
    }

    // 2. ER_DUP_ENTRY (1062): Tentou cadastrar um campo UNIQUE que já existe (ex: e-mail)
    if (erro.code === "ER_DUP_ENTRY" || erro.errno === 1062) {
        return res.status(409).json({ erro: "Este e-mail já está cadastrado no sistema." });
    }

    // 3. ER_NO_REFERENCED_ROW_2 (1452): Chave Estrangeira não existe 
    // Ex: Tentar criar um produto com uma categoria_id que não existe no banco
    if (erro.code === "ER_NO_REFERENCED_ROW_2" || erro.errno === 1452) {
        return res.status(400).json({ erro: "O registro relacionado (ex: cliente, categoria ou endereço) não existe." });
    }

    // 4. ER_ROW_IS_REFERENCED_2 (1451): Tentou deletar um registro com vínculos
    // Ex: Tentar deletar um cliente que já tem pedidos ou itens no carrinho
    if (erro.code === "ER_ROW_IS_REFERENCED_2" || erro.errno === 1451) {
        return res.status(409).json({
            erro: "Este registro possui dados vinculados (ex: pedidos/endereço) e não pode ser excluído."
        });
    }

    // 5. Erros de validação padrão com status próprio
    if (Number.isInteger(erro.status) && erro.status >= 400 && erro.status < 500) {
        return res.status(erro.status).json({ erro: "Corpo da requisição inválido" });
    }

    // 6. Erro 500 para qualquer outra coisa imprevista
    console.error("Erro na API:", erro.code || erro.message);
    return res.status(500).json({ erro: "Não foi possível concluir a operação" });
}