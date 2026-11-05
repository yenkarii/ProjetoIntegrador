CREATE DATABASE IF NOT EXISTS projeto_integrador;
USE projeto_integrador;

-- 1. CLIENTE
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

-- 2. CADASTRO
CREATE TABLE cadastro (
    id_cadastro INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL UNIQUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- 3. CONSULTA
CREATE TABLE consulta (
    id_consulta INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    descricao VARCHAR(255),
    data_consulta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- 4. LOGIN
CREATE TABLE login (
    id_login INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL UNIQUE,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- 5. COMPRA
CREATE TABLE compra (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'Pendente',
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- 6. VENDA
CREATE TABLE venda (
    id_venda INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL UNIQUE,
    data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES compra(id_compra)
);

-- 7. NOTA FISCAL
CREATE TABLE nota_fiscal (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL UNIQUE,
    id_cliente INT NOT NULL,
    numero VARCHAR(50) NOT NULL UNIQUE,
    data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_compra) REFERENCES compra(id_compra),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- 8. CARRINHO DE COMPRA
CREATE TABLE carrinho_de_compra (
    id_carrinho INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    produto VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

-- CONFERIR AS TABELAS
SHOW TABLES;