import conn from "../../db.js";

export async function listar() {
    const sql = 'SELECT * FROM item_pedido ORDER BY id_item';
    const [resp] = await conn.promise().query(sql);
    return resp;
}

export async function buscarPorId(id) {
    const sql = 'SELECT * FROM item_pedido WHERE id_item = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp;
}

export async function criar(dados) {
    const sql = 'INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)';
    const [resp] = await conn.promise().query(sql, [dados.id_pedido, dados.id_produto, dados.quantidade, dados.preco_unitario]);
    return resp.insertId;
}

export async function atualizar(id, dados) {
    const sql = 'UPDATE item_pedido SET id_pedido = ?, id_produto = ?, quantidade = ?, preco_unitario = ? WHERE id_item = ?';
    const [resp] = await conn.promise().query(sql, [dados.id_pedido, dados.id_produto, dados.quantidade, dados.preco_unitario, id]);
    return resp.affectedRows;
}

export async function deletar(id) {
    const sql = 'DELETE FROM item_pedido WHERE id_item = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp.affectedRows;
}