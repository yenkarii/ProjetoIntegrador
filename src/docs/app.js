// PRODUTOS DA LOJA
const produtos = [
    { id: 1, nome: "Sabonete Natural", preco: 25.00, imagem: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500" },
    { id: 2, nome: "Creme Hidratante", preco: 39.90, imagem: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500" },
    { id: 3, nome: "Óleo Corporal", preco: 32.00, imagem: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500" },
    { id: 4, nome: "Shampoo Natural", preco: 29.90, imagem: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500" },
    { id: 5, nome: "Condicionador Natural", preco: 31.90, imagem: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500" },
    { id: 6, nome: "Máscara Facial", preco: 35.00, imagem: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500" },
    { id: 7, nome: "Esfoliante Natural", preco: 27.90, imagem: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500" },
    { id: 8, nome: "Protetor Labial", preco: 15.00, imagem: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500" },
    { id: 9, nome: "Sérum Facial", preco: 45.90, imagem: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500" },
    { id: 10, nome: "Creme para as Mãos", preco: 22.90, imagem: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500" }
];

let carrinho = [];


// FORMATAR PREÇOS
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// MOSTRAR PRODUTOS
function mostrarProdutos() {
    let lista = document.getElementById("lista-produtos");
    lista.innerHTML = "";

    produtos.forEach(function (produto) {
        lista.innerHTML += `
            <div class="produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>${formatarPreco(produto.preco)}</p>
                <button onclick="adicionarCarrinho(${produto.id})">
                    Adicionar ao carrinho
                </button>
            </div>
        `;
    });
}


const timersCarrinho = {}; // Guarda os cronômetros (debounce) por produto

// PEGAR CLIENTE LOGADO
function getClienteLogado() {
    const salvo = localStorage.getItem("clienteLogado");
    return salvo ? JSON.parse(salvo) : null;
}

// CARREGAR CARRINHO DO BANCO QUANDO ABRIR O SITE
async function carregarCarrinhoBanco() {
    const cliente = getClienteLogado();
    if (!cliente) return;

    try {
        // Confira no server.js se a rota é /carrinhos ou /carrinho
        const resp = await fetch("http://localhost:3000/carrinhos");
        const todosCarrinhos = await resp.json();

        // Filtra só os itens desse cliente e cruza com a lista 'produtos' para pegar nome, preço e foto
        const itensDoCliente = todosCarrinhos.filter(c => c.id_cliente === cliente.id_cliente);

        carrinho = itensDoCliente.map(itemBanco => {
            const prod = produtos.find(p => p.id === itemBanco.id_produto);
            return {
                id_carrinho: itemBanco.id_carrinho,
                id: itemBanco.id_produto,
                nome: prod ? prod.nome : "Produto",
                preco: prod ? prod.preco : 0,
                imagem: prod ? prod.imagem : "",
                quantidade: itemBanco.quantidade
            };
        });

        mostrarCarrinho();
    } catch (erro) {
        console.error("Erro ao carregar carrinho do banco:", erro);
    }
}

// SINCRONIZAR COM O MYSQL (ESPERA 500ms SEM CLIQUES ANTES DE MANDAR)
function sincronizarItemBanco(idProduto, idCarrinhoAntigo = null) {
    const cliente = getClienteLogado();
    if (!cliente) return;

    // Se já tinha um envio agendado para esse produto, cancela e reinicia o tempo
    clearTimeout(timersCarrinho[idProduto]);

    timersCarrinho[idProduto] = setTimeout(async () => {
        const itemAtual = carrinho.find(item => item.id === idProduto);

        try {
            // CASO 1: Item foi removido do carrinho -> DELETE no banco
            if (!itemAtual) {
                const idParaDeletar = idCarrinhoAntigo;
                if (idParaDeletar) {
                    await fetch(`http://localhost:3000/carrinhos/${idParaDeletar}`, {
                        method: "DELETE"
                    });
                }
                return;
            }

            // CASO 2: Item já existe na tabela carrinho -> PUT (atualiza quantidade)
            if (itemAtual.id_carrinho) {
                await fetch(`http://localhost:3000/carrinhos/${itemAtual.id_carrinho}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_cliente: cliente.id_cliente,
                        id_produto: itemAtual.id,
                        quantidade: itemAtual.quantidade
                    })
                });
            }
            // CASO 3: Item novo -> POST (cria linha no banco e guarda o id_carrinho gerado)
            else {
                const resp = await fetch("http://localhost:3000/carrinhos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_cliente: cliente.id_cliente,
                        id_produto: itemAtual.id,
                        quantidade: itemAtual.quantidade
                    })
                });
                const criado = await resp.json();

                // Guarda o id_carrinho retornado pelo MySQL para os próximos cliques virarem PUT
                let novoId = criado.id_carrinho || criado.id || criado.insertId;
                if (!novoId) {
                    const lista = await (await fetch("http://localhost:3000/carrinhos")).json();
                    const achado = lista.find(
                        c => c.id_cliente === cliente.id_cliente && c.id_produto === itemAtual.id
                    );
                    if (achado) novoId = achado.id_carrinho;
                }
                itemAtual.id_carrinho = novoId;
            }
        } catch (erro) {
            console.error("Erro ao sincronizar item no carrinho:", erro);
        }
    }, 500); // 500ms de espera contra spam de cliques
}


// ADICIONAR AO CARRINHO
function adicionarCarrinho(id) {
    if (!getClienteLogado()) {
        alert("Faça login para adicionar produtos ao carrinho!");
        window.location.href = "login.html";
        return;
    }

    let produto = produtos.find(item => item.id === id);
    let item = carrinho.find(item => item.id === id);

    if (item) {
        item.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    mostrarCarrinho();
    sincronizarItemBanco(id);
}


// AUMENTAR QUANTIDADE
function aumentarQuantidade(id) {
    let item = carrinho.find(item => item.id === id);
    if (!item) return;

    item.quantidade++;
    mostrarCarrinho();
    sincronizarItemBanco(id);
}


// DIMINUIR QUANTIDADE
function diminuirQuantidade(id) {
    let item = carrinho.find(item => item.id === id);
    if (!item) return;

    item.quantidade--;

    if (item.quantidade === 0) {
        removerCarrinho(id);
    } else {
        mostrarCarrinho();
        sincronizarItemBanco(id);
    }
}


// REMOVER PRODUTO
function removerCarrinho(id) {
    const itemRemovido = carrinho.find(item => item.id === id);
    const idCarrinhoAntigo = itemRemovido ? itemRemovido.id_carrinho : null;

    carrinho = carrinho.filter(item => item.id !== id);
    mostrarCarrinho();
    sincronizarItemBanco(id, idCarrinhoAntigo);
}


// ABRIR PAGAMENTO
document.getElementById("finalizar-compra").addEventListener("click", function () {
    if (!localStorage.getItem("clienteLogado")) {
        alert("Faça login para finalizar a compra!");
        window.location.href = "login.html";
        return;

    }
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    document.getElementById("pagamento").style.display = "block";
    document.getElementById("pagamento").scrollIntoView({
        behavior: "smooth"
    });
});


// ESCOLHER FORMA DE PAGAMENTO
document.getElementById("forma-pagamento").addEventListener("change", function () {
    let forma = this.value;
    let dados = document.getElementById("dados-pagamento");

    if (forma === "pix") {
        dados.innerHTML = `
            <h3>Pagamento via PIX</h3>
            <p>Chave demonstrativa: biocosmetics@email.com</p>
            <p>Valor: ${document.getElementById("total").textContent}</p>
            <p>Pagamento simulado para demonstração.</p>
        `;
    }

    else if (forma === "cartao") {
        dados.innerHTML = `
            <h3>Cartão de crédito</h3>
            <input type="text" id="nome-cartao" placeholder="Nome do titular">
            <input type="text" id="numero-cartao" placeholder="Número do cartão">
            <input type="text" id="validade" placeholder="Validade (MM/AA)">
            <input type="text" id="cvv" placeholder="CVV">
            <p>Use apenas dados fictícios nesta demonstração.</p>
        `;
    }

    else if (forma === "boleto") {
        dados.innerHTML = `
            <h3>Pagamento via boleto</h3>
            <p>Boleto demonstrativo</p>
            <p>12345.67890 12345.678901</p>
            <p>Este código não é válido para pagamento.</p>
        `;
    }

    else {
        dados.innerHTML = "";
    }
});


// BUSCAR CLIENTE E ENDEREÇO PELO CPF
let idClienteAtual = null;
let temEnderecoCadastrado = false;

document.getElementById("cpf").addEventListener("input", async function () {
    const cpf = this.value.replace(/\D/g, "").trim();

    if (cpf.length !== 11) {
        idClienteAtual = null;
        temEnderecoCadastrado = false;
        return;
    }

    try {
        const resp = await fetch("http://localhost:3000/clientes");
        const clientes = await resp.json();
        const clienteEncontrado = clientes.find(
            c => String(c.cpf).replace(/\D/g, "") === cpf
        );

        if (!clienteEncontrado) {
            idClienteAtual = null;
            temEnderecoCadastrado = false;
            alert("CPF não encontrado no cadastro!");
            return;
        }

        idClienteAtual = clienteEncontrado.id_cliente;

        const respEnd = await fetch("http://localhost:3000/enderecos");
        const enderecos = await respEnd.json();
        const enderecoEncontrado = enderecos.find(e => e.id_cliente === idClienteAtual);

        if (enderecoEncontrado) {
            temEnderecoCadastrado = true;
            document.getElementById("cep").value = enderecoEncontrado.cep;
            document.getElementById("rua").value = enderecoEncontrado.rua;
            document.getElementById("numero").value = enderecoEncontrado.numero;
            document.getElementById("cidade").value = enderecoEncontrado.cidade;
        } else {
            temEnderecoCadastrado = false;
            document.getElementById("cep").value = "";
            document.getElementById("rua").value = "";
            document.getElementById("numero").value = "";
            document.getElementById("cidade").value = "";
        }
    } catch (erro) {
        console.error("Erro ao buscar cliente/endereço:", erro);
    }
});


// CONFIRMAR PAGAMENTO (SALVA ENDEREÇO + PEDIDO + ITENS + NOTA FISCAL)
document.getElementById("confirmar-pagamento").addEventListener("click", async function () {
    const forma = document.getElementById("forma-pagamento").value;
    const cep = document.getElementById("cep").value.trim();
    const rua = document.getElementById("rua").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const cidade = document.getElementById("cidade").value.trim();

    // 1. Validações básicas
    if (forma === "") {
        alert("Escolha uma forma de pagamento!");
        return;
    }

    if (forma === "cartao") {
        const nome = document.getElementById("nome-cartao").value.trim();
        const numCartao = document.getElementById("numero-cartao").value.trim();
        const validade = document.getElementById("validade").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        if (!nome || !numCartao || !validade || !cvv) {
            alert("Preencha todos os campos do cartão!");
            return;
        }
    }

    if (!idClienteAtual) {
        alert("Digite um CPF válido e cadastrado!");
        return;
    }

    if (!cep || !rua || !numero || !cidade) {
        alert("Preencha todos os campos do endereço de entrega!");
        return;
    }

    // Calcula o valor total do carrinho
    const totalPedido = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);

    try {
        // PASSO A: Se o cliente ainda não tinha endereço no banco, cadastra agora
        if (!temEnderecoCadastrado) {
            await fetch("http://localhost:3000/enderecos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_cliente: idClienteAtual,
                    rua: rua,
                    numero: numero,
                    cidade: cidade,
                    cep: cep
                })
            });
        }

        // PASSO B: Cria o pedido na tabela 'pedido'
        const respPedido = await fetch("http://localhost:3000/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_cliente: idClienteAtual,
                valor_total: totalPedido,
                status: "Pago"
            })
        });
        const pedidoCriado = await respPedido.json();

        // Pega o id_pedido gerado pelo MySQL (funciona independente de como seu controller devolve o ID)
        let idPedido = pedidoCriado.id_pedido || pedidoCriado.id || pedidoCriado.insertId;
        if (!idPedido) {
            const listaPedidos = await (await fetch("http://localhost:3000/pedidos")).json();
            const pedidosDoCliente = listaPedidos.filter(p => p.id_cliente === idClienteAtual);
            idPedido = pedidosDoCliente[pedidosDoCliente.length - 1].id_pedido;
        }

        // PASSO C: Salva cada produto do carrinho na tabela 'item_pedido'
        for (const item of carrinho) {
            await fetch("http://localhost:3000/itens-pedido", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_pedido: idPedido,
                    id_produto: item.id,
                    quantidade: item.quantidade,
                    preco_unitario: item.preco
                })
            });
        }

        // PASSO D: Emite a nota fiscal na tabela 'nota_fiscal'
        const numeroNota = "NF-" + Date.now(); // Gera um código único (ex: NF-1795522140123)
        await fetch("http://localhost:3000/notas-fiscais", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_pedido: idPedido,
                numero_nota: numeroNota,
                valor_total: totalPedido
            })
        });

        // PASSO E: Sucesso! Limpa o carrinho e fecha o pagamento
        alert(`Pedido #${idPedido} confirmado com sucesso!\nNota Fiscal emitida: ${numeroNota}`);
        // Limpa os itens da tabela 'carrinho' no MySQL após finalizar o pedido
        for (const item of carrinho) {
            if (item.id_carrinho) {
                await fetch(`http://localhost:3000/carrinhos/${item.id_carrinho}`, {
                    method: "DELETE"
                });
            }
        }
        carrinho = [];
        mostrarCarrinho();

        document.getElementById("pagamento").style.display = "none";
        document.getElementById("forma-pagamento").value = "";
        document.getElementById("dados-pagamento").innerHTML = "";
        window.location.hash = "inicio";

    } catch (erro) {
        console.error("Erro ao finalizar pedido:", erro);
        alert("Erro ao registrar pedido no servidor. Olhe o console (F12).");
    }
});


// CARROSSEL
let slideAtual = 0;
let intervaloSlide;

function mostrarSlide(numero) {
    let slides = document.querySelectorAll(".slide");
    let pontos = document.querySelectorAll(".ponto");

    // Limpa marcações antigas antes de trocar
    slides.forEach(slide => slide.classList.remove("anterior-slide"));

    // O slide atual deixa de ser ativo e vira o "fundo" da transição
    slides[slideAtual].classList.remove("ativo");
    slides[slideAtual].classList.add("anterior-slide");
    pontos[slideAtual].classList.remove("ativo");

    slideAtual = (numero + slides.length) % slides.length;

    // O slide novo assume o topo e dispara a animação de fade in
    slides[slideAtual].classList.remove("anterior-slide");
    slides[slideAtual].classList.add("ativo");
    pontos[slideAtual].classList.add("ativo");

    clearInterval(intervaloSlide);
    intervaloSlide = setInterval(function () {
        mudarSlide(1);
    }, 5000);
}

function mudarSlide(direcao) {
    mostrarSlide(slideAtual + direcao);
}

// Inicia o cronômetro pela primeira vez quando a página abre
intervaloSlide = setInterval(function () {
    mudarSlide(1);
}, 5000);


// INICIAR SITE
mostrarProdutos();
mostrarCarrinho();

// VERIFICAR LOGIN 
function verificarLogin() {
    const clienteSalvo = localStorage.getItem("clienteLogado");
    const botaoCadastrar = document.querySelector('nav a[href="signup.html"]');
    const botaoEntrar = document.querySelector('nav a[href="login.html"]');
    const botaoCarrinho = document.querySelector('nav a[href="#carrinho"]');

    if (clienteSalvo) {
        const cliente = JSON.parse(clienteSalvo);

        if (botaoCadastrar) {
            botaoCadastrar.style.display = "none";
        }
        // mudar o "ENTRAR" pelo primeiro nome do usuário e foto de perfil
        if (botaoEntrar) {
            const primeiroNome = cliente.nome ? cliente.nome.split(" ")[0] : "Cliente";
            botaoEntrar.style.gap = '8px';

            botaoEntrar.innerHTML = `
            <img src="assets/imgs/defaultpfp.jpg" alt="Perfil" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover;">
            <span>Olá, ${primeiroNome} (Sair)</span>
            `

            botaoEntrar.addEventListener("click", function (event) {
                event.preventDefault();
                localStorage.removeItem("clienteLogado");
                window.location.reload();
            });
        }
    } else {
        if (botaoCarrinho) {
            botaoCarrinho.addEventListener("click", function (event) {
                event.preventDefault();
                alert("Faça login para acessar o carrinho!");
                window.location.href = "login.html";
            });
        }
    }
}

verificarLogin();
mostrarProdutos();
await carregarCarrinhoBanco(); // Carrega o carrinho salvo do usuário logado