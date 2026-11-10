CREATE DATABASE IF NOT EXISTS projeto_integrador;
USE projeto_integrador;

CREATE TABLE cliente (
	id_cliente INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR (100) NOT NULL UNIQUE,
	senha VARCHAR(255) NOT NULL,
	data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE endereco (
	id_endereco INT AUTO_INCREMENT PRIMARY KEY,
	id_cliente INT NOT NULL,
	rua VARCHAR(150) NOT NULL,
	numero VARCHAR(20) NOT NULL,
	cidade VARCHAR(50) NOT NULL,
	cep VARCHAR(10) NOT NULL,
	FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE categoria (
	id_categoria INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE produto (
	id_produto INT AUTO_INCREMENT PRIMARY KEY,
	id_categoria INT NOT NULL,
	nome VARCHAR(100) NOT NULL,
	preco DECIMAL(10,2) NOT NULL,
	estoque INT NOT NULL DEFAULT 0,
	FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE carrinho (
	id_carrinho INT AUTO_INCREMENT PRIMARY KEY,
	id_cliente INT NOT NULL,
	id_produto INT NOT NULL,
	quantidade INT NOT NULL DEFAULT 1,
	FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
	FOREIGN KEY (id_produto) REFERENCES produto(id_produto) ON DELETE CASCADE
);

CREATE TABLE pedido (
	id_pedido INT AUTO_INCREMENT PRIMARY KEY,
	id_cliente INT NOT NULL,
	data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
	valor_total DECIMAL (10,2) NOT NULL DEFAULT 0.00,
	status VARCHAR(30) NOT NULL DEFAULT 'Pendente',
	FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE item_pedido(
	id_item INT AUTO_INCREMENT PRIMARY KEY,
	id_pedido INT NOT NULL,
	id_produto INT NOT NULL,
	quantidade INT NOT NULL,
	preco_unitario DECIMAL (10,2) NOT NULL,
	FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
	FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

CREATE TABLE nota_fiscal(
	id_nota INT AUTO_INCREMENT PRIMARY KEY,
	id_pedido INT NOT NULL UNIQUE,s
	numero_nota VARCHAR(50) NOT NULL UNIQUE,
	data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
	valor_total DECIMAL (10,2) NOT NULL,
	FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);
	
SHOW TABLES;