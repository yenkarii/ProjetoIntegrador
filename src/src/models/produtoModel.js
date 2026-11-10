import conn from "../../db.js";

export async function listar() {
    const sql = 'SELECT * FROM produto ORDER BY id_produto';
    const [resp] = await conn.promise().query(sql);
    return resp;
}

export async function buscarPorId(id) {
    const sql = 'SELECT * FROM produto WHERE id_produto = ?'
    const [resp] = await conn.promise().query(sql, [id]);
    return resp;
}

export async function criar(dados) {
    const sql = 'INSERT INTO produto (id_categoria, nome, preco, estoque) VALUES (?, ?, ?, ?)';
    const [resp] = await conn.promise().query(sql, [dados.id_categoria, dados.nome, dados.preco, dados.estoque]);
    return resp.insertId;
}

export async function atualizar(id, dados) {
    const sql = 'UPDATE produto SET id_categoria = ?, nome = ?, preco = ?, estoque = ?';
    const [resp] = await conn.promise().query(sql, [dados.id_categoria, dados.nome, dados.preco, dados.estoque]);
    return resp.affectedRows;
}

export async function deletar(id) {
    const sql = 'DELETE FROM produto WHERE id_produto = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp.affectedRows;
}