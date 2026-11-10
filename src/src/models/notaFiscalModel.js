import conn from "../../db.js";

export async function listar() {
    const sql = 'SELECT * FROM nota_fiscal ORDER BY id_nota';
    const [resp] = await conn.promise().query(sql);
    return resp;
}

export async function buscarPorId(id) {
    const sql = 'SELECT * FROM nota_fiscal WHERE id_nota = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp;
}

export async function criar(dados) {
    const sql = 'INSERT INTO nota_fiscal (id_pedido, numero_nota, valor_total) VALUES (?, ?, ?)';
    const [resp] = await conn.promise().query(sql, [dados.id_pedido, dados.numero_nota, dados.valor_total]);
    return resp.insertId;
}

export async function atualizar(id, dados) {
    const sql = 'UPDATE nota_fiscal SET id_pedido = ?, numero_nota = ?, valor_total = ? WHERE id_nota = ?';
    const [resp] = await conn.promise().query(sql, [dados.id_pedido, dados.numero_nota, dados.valor_total, id]);
    return resp.affectedRows;
}

export async function deletar(id) {
    const sql = 'DELETE FROM nota_fiscal WHERE id_nota = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp.affectedRows;
}