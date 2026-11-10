import conn from "../../db.js";

export async function listar(callback) {
    const sql = 'SELECT * FROM endereco ORDER BY id_endereco';
    const [resp] = await conn.promise().query(sql);
    return resp;
}

export async function buscarPorId(id) {
    const sql = 'SELECT * FROM endereco WHERE id_endereco = ?'
    const [resp] = await conn.promise().query(sql, [id]);
    return resp;
}

export async function criar(dados) {
    const sql = 'INSERT INTO endereco (id_cliente, rua, numero, cidade, cep) VALUES (?, ?, ?, ?, ?)';
    const [resp] = await conn.promise().query(sql,[dados.id_cliente, dados.rua, dados.numero, dados.cidade, dados.cep]);
    return resp.insertId;
}

export async function atualizar(id, dados) {
    const sql = 'UPDATE endereco SET id_cliente = ?, rua = ?, numero = ?, cidade = ?, cep = ?';
    const [resp] = await conn.promise().query(sql,[dados.id_cliente, dados.rua, dados.numero, dados.cidade, dados.cep]);
    return resp.affectedRows;
}

export async function deletar(id) {
    const sql = 'DELETE FROM endereco WHERE id_endereco = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp.affectedRows;
}