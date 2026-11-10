import conn from "../../db.js";

export async function listar() {
    const sql = 'SELECT * FROM pedido ORDER BY id_pedido';
    const [resp] = await conn.promise().query(sql);
    return resp;
}

export async function buscarPorId(id) {
    const sql = 'SELECT * FROM pedido WHERE id_pedido = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp;
}

export async function criar(dados) {
    const sql = 'INSERT INTO pedido (id_cliente, valor_total, status) VALUES (?, ?, ?)';
    const [resp] = await conn.promise().query(sql, [dados.id_cliente, dados.valor_total || 0.00, dados.status || 'Pendente']);
    return resp.insertId;
}

export async function atualizar(id, dados) {
    const sql = 'UPDATE pedido SET id_cliente = ?, valor_total = ?, status = ? WHERE id_pedido = ?';
    const [resp] = await conn.promise().query(sql, [dados.id_cliente, dados.valor_total, dados.status, id]);
    return resp.affectedRows;
}

export async function deletar(id) {
    const sql = 'DELETE FROM pedido WHERE id_pedido = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp.affectedRows;
}