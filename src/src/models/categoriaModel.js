import conn from "../../db.js";

export async function listar(callback) {
    const sql = 'SELECT * FROM endereco ORDER BY id_categoria';
    const [resp] = await conn.promise().query(sql);
    return resp;
}

export async function buscarPorId(id) {
    const sql = 'SELECT * FROM endereco WHERE id_categoria = ?'
    const [resp] = await conn.promise().query(sql, [id]);
    return resp;
}

export async function criar(dados) {
    const sql = 'INSERT INTO categoria (nome) VALUES (?)';
    const [resp] = await conn.promise().query(sql, [dados.nome]);
    return resp.insertId;
}

export async function atualizar(id, dados) {
    const sql = 'UPDATE categoria SET nome = ?';
    const [resp] = await conn.promise().query(sql,[dados.nome]);
    return resp.affectedRows;
}

export async function deletar(id) {
    const sql = 'DELETE FROM categoria WHERE id_categoria = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp.affectedRows;
}