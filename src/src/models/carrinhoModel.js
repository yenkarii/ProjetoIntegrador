import conn from "../../db.js";

export async function listar() {
    const sql = 'SELECT * FROM carrinho ORDER BY id_carrinho';
    const [resp] = await conn.promise().query(sql);
    return resp;
}

export async function buscarPorId(id) {
    const sql = 'SELECT * FROM carrinho WHERE id_carrinho = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp;
}

export async function criar(dados) {
    const sql = 'INSERT INTO carrinho (id_cliente, id_produto, quantidade) VALUES (?, ?, ?)';
    const [resp] = await conn.promise().query(sql, [dados.id_cliente, dados.id_produto, dados.quantidade || 1]);
    return resp.insertId;
}

export async function atualizar(id, dados) {
    const sql = 'UPDATE carrinho SET id_cliente = ?, id_produto = ?, quantidade = ? WHERE id_carrinho = ?';
    const [resp] = await conn.promise().query(sql, [dados.id_cliente, dados.id_produto, dados.quantidade, id]);
    return resp.affectedRows;
}

export async function deletar(id) {
    const sql = 'DELETE FROM carrinho WHERE id_carrinho = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp.affectedRows;
}