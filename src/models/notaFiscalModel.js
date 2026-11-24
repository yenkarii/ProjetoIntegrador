import conn from "../../db.js";

export async function listar() {
    const sql = `SELECT n.*,
                p.id_pedido AS pedido
                FROM nota_fiscal n
                INNER JOIN pedido p
                    ON n.id_pedido = p.id_pedido
                ORDER BY n.id_nota`;
    const [resp] = await conn.promise().query(sql);
    return resp;
}

export async function buscarPorId(id) {
    const sql = `SELECT n.*,
                p.id_pedido AS pedido
                FROM nota_fiscal n
                INNER JOIN pedido p
                    ON n.id_pedido = p.id_pedido
                WHERE n.id_nota = ?
                ORDER BY n.id_nota`;
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