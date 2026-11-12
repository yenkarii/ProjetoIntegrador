import conn from "../../db.js";

export async function listar() {
    const sql = `SELECT ip.*,
                    pr.nome AS produto,
                    pe.id_pedido AS pedido
                FROM item_pedido ip 
                INNER JOIN produto pr
                    ON ip.id_produto = pr.id_produto
                INNER JOIN pedido pe
                    ON ip.id_pedido = pe.id_pedido
                ORDER BY ip.id_item`;
    const [resp] = await conn.promise().query(sql);
    return resp;
}

export async function buscarPorId(id) {
    const sql = `SELECT ip.*,
                    pr.nome AS produto,
                    pe.id_pedido AS pedido
                FROM item_pedido ip 
                INNER JOIN produto pr
                    ON ip.id_produto = pr.id_produto
                INNER JOIN pedido pe
                    ON ip.id_pedido = pe.id_pedido
                WHERE ip.id_item = ?
                ORDER BY ip.id_item`;
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