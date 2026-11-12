
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

    produtos.forEach(function(produto) {
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


// ADICIONAR AO CARRINHO
function adicionarCarrinho(id) {
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
}


// AUMENTAR QUANTIDADE
function aumentarQuantidade(id) {
    let item = carrinho.find(item => item.id === id);
    item.quantidade++;
    mostrarCarrinho();
}


// DIMINUIR QUANTIDADE
function diminuirQuantidade(id) {
    let item = carrinho.find(item => item.id === id);
    item.quantidade--;

    if (item.quantidade === 0) {
        removerCarrinho(id);
    } else {
        mostrarCarrinho();
    }
}


// REMOVER PRODUTO
function removerCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    mostrarCarrinho();
}


// MOSTRAR CARRINHO
function mostrarCarrinho() {
    let lista = document.getElementById("lista-carrinho");
    let total = 0;

    lista.innerHTML = "";

    if (carrinho.length === 0) {
        lista.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    carrinho.forEach(function(item) {
        let subtotal = item.preco * item.quantidade;
        total += subtotal;

        lista.innerHTML += `
            <div class="item-carrinho">
                <p>${item.nome}</p>
                <p>${formatarPreco(item.preco)}</p>
                <div>
                    <button onclick="diminuirQuantidade(${item.id})">-</button>
                    ${item.quantidade}
                    <button onclick="aumentarQuantidade(${item.id})">+</button>
                </div>
                <p>Subtotal: ${formatarPreco(subtotal)}</p>
                <button onclick="removerCarrinho(${item.id})">Remover</button>
            </div>
        `;
    });

    document.getElementById("total").textContent = formatarPreco(total);
}


// ABRIR PAGAMENTO
document.getElementById("finalizar-compra").addEventListener("click", function() {
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
document.getElementById("forma-pagamento").addEventListener("change", function() {
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


// CONFIRMAR PAGAMENTO
document.getElementById("confirmar-pagamento").addEventListener("click", function() {
    let forma = document.getElementById("forma-pagamento").value;

    if (forma === "") {
        alert("Escolha uma forma de pagamento!");
        return;
    }

    if (forma === "cartao") {
        let nome = document.getElementById("nome-cartao").value.trim();
        let numero = document.getElementById("numero-cartao").value.trim();
        let validade = document.getElementById("validade").value.trim();
        let cvv = document.getElementById("cvv").value.trim();

        if (!nome || !numero || !validade || !cvv) {
            alert("Preencha todos os campos do cartão!");
            return;
        }
    }

    alert("Pagamento simulado com sucesso! Obrigado por comprar na BioCosmetics.");

    carrinho = [];
    mostrarCarrinho();

    document.getElementById("pagamento").style.display = "none";
    document.getElementById("forma-pagamento").value = "";
    document.getElementById("dados-pagamento").innerHTML = "";

    window.location.hash = "inicio";
});


// CARROSSEL
let slideAtual = 0;

function mostrarSlide(numero) {
    let slides = document.querySelectorAll(".slide");
    let pontos = document.querySelectorAll(".ponto");

    slides[slideAtual].classList.remove("ativo");
    pontos[slideAtual].classList.remove("ativo");

    slideAtual = (numero + slides.length) % slides.length;

    slides[slideAtual].classList.add("ativo");
    pontos[slideAtual].classList.add("ativo");
}

function mudarSlide(direcao) {
    mostrarSlide(slideAtual + direcao);
}

setInterval(function() {
    mudarSlide(1);
}, 5000);


// INICIAR SITE
mostrarProdutos();
mostrarCarrinho();
