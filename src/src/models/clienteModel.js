import conn from "../../db.js";

export async function listar(callback) {
    const sql = 'SELECT * FROM cliente ORDER BY id_cliente';
    const [resp] = await conn.promise().query(sql);
    return resp;
}

export async function buscarPorId(id) {
    const sql = 'SELECT * FROM cliente WHERE id_cliente = ?'
    const [resp] = await conn.promise().query(sql, [id]);
    return resp;
}

export async function criar(dados) {
    const sql = 'INSERT INTO cliente (nome, email, senha) VALUES (?, ?, ?)';
    const [resp] = await conn.promise().query(sql,[dados.nome, dados.email, dados.senha]);
    return resp.insertId;
}

export async function atualizar(id, dados) {
    const sql = 'UPDATE cliente SET nome = ?, email = ?, senha = ?';
    const [resp] = await conn.promise().query(sql,[dados.nome, dados.email, dados.senha]);
    return resp.affectedRows;
}

export async function deletar(id) {
    const sql = 'DELETE FROM cliente WHERE id_cliente = ?';
    const [resp] = await conn.promise().query(sql, [id]);
    return resp.affectedRows;
}