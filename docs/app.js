let produtos = [];
let carrinho = [];
const imagemPadrao = "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500";
const timersCarrinho = {}; // Guarda os cronômetros (debounce) por produto
// debounce: espera parar de clicar por 500ms antes de mandar pro banco pra não spammar requisição


// FORMATAR PREÇOS
function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// BUSCAR PRODUTOS DO BANCO DE DADOS
async function carregarProdutos() {
    const lista = document.getElementById("lista-produtos");

    try {
        const resp = await fetch("http://localhost:3000/produtos");
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}`);
        }

        const dadosBanco = await resp.json();

        produtos = dadosBanco.map(p => ({
            id: p.id_produto,
            nome: p.nome,
            preco: Number(p.preco),
            imagem: p.imagem || imagemPadrao
        }));

        mostrarProdutos();
        await carregarCarrinhoBanco();
    } catch (erro) {
        console.error("Erro ao carregar produtos do banco:", erro);
        if (lista) {
            lista.innerHTML = "<p>Não foi possível carregar os produtos agora.</p>";
        }
    }
}


// MOSTRAR PRODUTOS
function mostrarProdutos() {
    let lista = document.getElementById("lista-produtos");
    lista.innerHTML = "";let produtos = []; // começa vazio pq agr vem tudo do banco
let carrinho = []; // array onde ficam os itens do carrinho na tela
const imagemPadrao = "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500"; // foto reserva se vier sem imagem
const timersCarrinho = {}; // guarda os timers de debounce por produto pra nao spammar o sql


// FORMATAR PREÇOS
function formatarPreco(valor) { // função pra deixar o número em formato real (R$)
    return valor.toLocaleString("pt-BR", { // usa o padrão brasileiro pt-BR
        style: "currency", // formata como moeda
        currency: "BRL" // moeda real brasileiro
    }); // fecha o toLocaleString
} // fecha formatarPreco


// BUSCAR PRODUTOS DO BANCO DE DADOS
async function carregarProdutos() { // busca os produtos da api de forma assíncrona
    const lista = document.getElementById("lista-produtos"); // pega a div onde os produtos aparecem

    try { // tenta fazer a requisição sem quebrar a página se der ruim
        const resp = await fetch("http://localhost:3000/produtos"); // chama a rota de produtos do back-end
        if (!resp.ok) { // vê se a resposta não foi 200-299
            throw new Error(`HTTP ${resp.status}`); // joga pro catch com o status do erro
        } // fecha if da resposta

        const dadosBanco = await resp.json(); // converte o retorno do servidor em json

        produtos = dadosBanco.map(p => ({ // adapta os campos do mysql pro formato do front
            id: p.id_produto, // mapeia id_produto pra id
            nome: p.nome, // pega o nome do produto
            preco: Number(p.preco), // garante q o preço seja número e não texto
            imagem: p.imagem || imagemPadrao // usa a imagem do banco ou a padrão se tiver vazia
        })); // fecha o map

        mostrarProdutos(); // desenha os produtos na tela depois q carregou
        await carregarCarrinhoBanco(); // puxa o carrinho salvo do usuário após ter os produtos
    } catch (erro) { // se deu algum erro no fetch ou no json
        console.error("Erro ao carregar produtos do banco:", erro); // mostra o erro no console f12
        if (lista) { // confere se a div existe na página
            lista.innerHTML = "<p>Não foi possível carregar os produtos agora.</p>"; // tira o carregando pra nao ficar preso
        } // fecha if lista
    } // fecha catch
} // fecha carregarProdutos


// MOSTRAR PRODUTOS
function mostrarProdutos() { // renderiza os cards dos produtos na vitrine
    let lista = document.getElementById("lista-produtos"); // pega o container dos produtos
    lista.innerHTML = ""; // limpa o conteúdo anterior (tipo "Carregando produtos...")

    if (produtos.length === 0) { // se não veio nenhum produto do banco
        lista.innerHTML = "<p>Nenhum produto cadastrado no momento.</p>"; // avisa na tela q tá vazio
        return; // sai da função
    } // fecha if vazio

    produtos.forEach(function (produto) { // percorre cada produto da lista
        lista.innerHTML += `
            <div class="produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>${formatarPreco(produto.preco)}</p>
                <button onclick="adicionarCarrinho(${produto.id})">
                    Adicionar ao carrinho
                </button>
            </div>
        `; // adiciona o html do card do produto
    }); // fecha forEach
} // fecha mostrarProdutos


// PEGAR CLIENTE LOGADO
function getClienteLogado() { // pega os dados do cliente salvo no navegador
    const salvo = localStorage.getItem("clienteLogado"); // lê a chave do localStorage
    return salvo ? JSON.parse(salvo) : null; // transforma de string pra objeto ou retorna null
} // fecha getClienteLogado


// CARREGAR CARRINHO DO BANCO QUANDO ABRIR O SITE
async function carregarCarrinhoBanco() { // recupera os itens do carrinho do usuário no banco
    const cliente = getClienteLogado(); // checa quem tá logado
    if (!cliente) return; // se ninguem tiver logado nao faz nada

    try { // tenta buscar o carrinho na api
        const resp = await fetch("http://localhost:3000/carrinhos"); // chama a rota de carrinhos
        if (!resp.ok) { // se a resposta deu erro http
            throw new Error(`HTTP ${resp.status}`); // manda pro catch
        } // fecha if

        const todosCarrinhos = await resp.json(); // pega todos os registros retornados
        const itensDoCliente = todosCarrinhos.filter(c => c.id_cliente === cliente.id_cliente); // filtra só os do cliente logado

        carrinho = itensDoCliente.map(itemBanco => { // monta o array do carrinho pra tela
            const prod = produtos.find(p => p.id === itemBanco.id_produto); // acha o produto correspondente
            return { // devolve o item formatado
                id_carrinho: itemBanco.id_carrinho, // guarda o id da linha na tabela carrinho
                id: itemBanco.id_produto, // id do produto
                nome: prod ? prod.nome : "Produto", // nome do produto ou fallback
                preco: prod ? prod.preco : 0, // preço unitário
                imagem: prod ? prod.imagem : imagemPadrao, // imagem do produto
                quantidade: itemBanco.quantidade // quantidade salva no banco
            }; // fecha objeto
        }); // fecha map

        mostrarCarrinho(); // atualiza o carrinho na tela
    } catch (erro) { // se deu erro ao carregar o carrinho
        console.error("Erro ao carregar carrinho do banco:", erro); // loga no console
    } // fecha catch
} // fecha carregarCarrinhoBanco


// SINCRONIZAR COM O MYSQL (ESPERA 500ms SEM CLIQUES ANTES DE MANDAR)
function sincronizarItemBanco(idProduto, idCarrinhoAntigo = null) { // salva ou atualiza o item no banco com debounce
    const cliente = getClienteLogado(); // pega o cliente logado
    if (!cliente) return; // sem login n sincroniza

    clearTimeout(timersCarrinho[idProduto]); // reseta o timer anterior desse produto se clicou dnv

    timersCarrinho[idProduto] = setTimeout(async () => { // espera 500ms antes de falar com o servidor
        const itemAtual = carrinho.find(item => item.id === idProduto); // busca como tá o item agr no array

        try { // tenta sincronizar com o back-end
            if (!itemAtual) { // se o item foi removido do carrinho
                if (idCarrinhoAntigo) { // e tinha id na tabela carrinho
                    await fetch(`http://localhost:3000/carrinhos/${idCarrinhoAntigo}`, { // chama o delete na api
                        method: "DELETE" // método http de exclusão
                    }); // fecha fetch delete
                } // fecha if idCarrinhoAntigo
                return; // termina aqui pq já deletou
            } // fecha if !itemAtual

            if (itemAtual.id_carrinho) { // se o item já existe no banco
                await fetch(`http://localhost:3000/carrinhos/${itemAtual.id_carrinho}`, { // manda put pro id do carrinho
                    method: "PUT", // método de atualização
                    headers: { "Content-Type": "application/json" }, // avisa q o corpo é json
                    body: JSON.stringify({ // envia os dados atualizados
                        id_cliente: cliente.id_cliente, // id do dono do carrinho
                        id_produto: itemAtual.id, // id do produto
                        quantidade: itemAtual.quantidade // nova quantidade
                    }) // fecha stringify
                }); // fecha fetch put
            } else { // se ainda não existia no banco
                const resp = await fetch("http://localhost:3000/carrinhos", { // cria o registro via post
                    method: "POST", // método de criação
                    headers: { "Content-Type": "application/json" }, // cabeçalho json
                    body: JSON.stringify({ // dados do novo item
                        id_cliente: cliente.id_cliente, // id do cliente
                        id_produto: itemAtual.id, // id do produto
                        quantidade: itemAtual.quantidade // quantidade inicial
                    }) // fecha stringify
                }); // fecha fetch post
                const criado = await resp.json(); // lê a resposta do servidor

                let novoId = criado.id_carrinho || criado.id || criado.insertId; // tenta pegar o id criado
                if (!novoId) { // se o back n devolveu o id direto
                    const lista = await (await fetch("http://localhost:3000/carrinhos")).json(); // busca a lista atualizada
                    const achado = lista.find( // procura a linha recém-criada
                        c => c.id_cliente === cliente.id_cliente && c.id_produto === itemAtual.id // bate cliente e produto
                    ); // fecha find
                    if (achado) novoId = achado.id_carrinho; // pega o id_carrinho achado
                } // fecha if !novoId
                itemAtual.id_carrinho = novoId; // salva o id no item pra futuros puts/deletes
            } // fecha else
        } catch (erro) { // se deu erro na requisição
            console.error("Erro ao sincronizar item no carrinho:", erro); // mostra no console
        } // fecha catch
    }, 500); // espera meio segundo de sossego nos cliques
} // fecha sincronizarItemBanco


// ADICIONAR AO CARRINHO
function adicionarCarrinho(id) { // coloca um produto no carrinho ou aumenta a qtd dele
    if (!getClienteLogado()) { // bloqueia se n tiver logado
        alert("Faça login para adicionar produtos ao carrinho!"); // avisa o usuário
        window.location.href = "login.html"; // manda pra tela de login
        return; // para a função
    } // fecha if login

    let produto = produtos.find(item => item.id === id); // acha o produto pelo id
    if (!produto) return; // se n achou n faz nada

    let item = carrinho.find(item => item.id === id); // vê se já tá no carrinho

    if (item) { // se já tiver lá
        item.quantidade++; // soma mais 1
    } else { // se for a primeira vez
        carrinho.push({ // adiciona um novo objeto no carrinho
            ...produto, // copia nome, preço, imagem e id
            quantidade: 1 // começa com 1 unidade
        }); // fecha push
    } // fecha else

    mostrarCarrinho(); // redesenha o carrinho na tela
    sincronizarItemBanco(id); // agenda o sync com o mysql
} // fecha adicionarCarrinho


// AUMENTAR QUANTIDADE
function aumentarQuantidade(id) { // botão + de um item do carrinho
    let item = carrinho.find(item => item.id === id); // acha o item no carrinho
    if (!item) return; // se n existir sai

    item.quantidade++; // aumenta 1 na quantidade
    mostrarCarrinho(); // atualiza a tela e o total
    sincronizarItemBanco(id); // sincroniza com o banco
} // fecha aumentarQuantidade


// DIMINUIR QUANTIDADE
function diminuirQuantidade(id) { // botão - de um item do carrinho
    let item = carrinho.find(item => item.id === id); // acha o item no carrinho
    if (!item) return; // se n existir sai

    item.quantidade--; // diminui 1 na quantidade

    if (item.quantidade === 0) { // se chegou a zero
        removerCarrinho(id); // tira o item do carrinho
    } else { // se ainda sobrou algum
        mostrarCarrinho(); // atualiza a tela
        sincronizarItemBanco(id); // sincroniza a nova qtd no banco
    } // fecha else
} // fecha diminuirQuantidade


// REMOVER PRODUTO
function removerCarrinho(id) { // botão remover item do carrinho
    const itemRemovido = carrinho.find(item => item.id === id); // guarda o item antes de tirar
    const idCarrinhoAntigo = itemRemovido ? itemRemovido.id_carrinho : null; // guarda o id do banco pra deletar

    carrinho = carrinho.filter(item => item.id !== id); // remove o item do array local
    mostrarCarrinho(); // atualiza a lista na tela
    sincronizarItemBanco(id, idCarrinhoAntigo); // manda delete pro banco
} // fecha removerCarrinho


// MOSTRAR CARRINHO
function mostrarCarrinho() { // monta o html do carrinho e calcula o total
    let lista = document.getElementById("lista-carrinho"); // pega a div do carrinho
    let total = 0; // acumulador do valor total

    lista.innerHTML = ""; // limpa os itens antigos antes de renderizar

    if (carrinho.length === 0) { // se o carrinho estiver vazio
        lista.innerHTML = "<p>Seu carrinho está vazio.</p>"; // mostra mensagem de vazio
    } // fecha if vazio

    carrinho.forEach(function (item) { // passa por cada item do carrinho
        let subtotal = item.preco * item.quantidade; // calcula o subtotal do item
        total += subtotal; // soma no total geral

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
        `; // insere o bloco html do item no carrinho
    }); // fecha forEach

    document.getElementById("total").textContent = formatarPreco(total); // atualiza o texto do total na tela
} // fecha mostrarCarrinho


// ABRIR PAGAMENTO
document.getElementById("finalizar-compra").addEventListener("click", function () { // clique no botão finalizar compra
    if (!localStorage.getItem("clienteLogado")) { // confere se tem alguém logado
        alert("Faça login para finalizar a compra!"); // avisa q precisa logar
        window.location.href = "login.html"; // redireciona pro login
        return; // interrompe o fluxo
    } // fecha if não logado
    if (carrinho.length === 0) { // vê se não tá tentando comprar com carrinho vazio
        alert("Seu carrinho está vazio!"); // avisa o usuário
        return; // sai fora
    } // fecha if carrinho vazio

    document.getElementById("pagamento").style.display = "block"; // mostra a seção de pagamento
    document.getElementById("pagamento").scrollIntoView({ // rola a tela suavemente até o pagamento
        behavior: "smooth" // animação suave de rolagem
    }); // fecha scrollIntoView
}); // fecha listener finalizar-compra


// ESCOLHER FORMA DE PAGAMENTO
document.getElementById("forma-pagamento").addEventListener("change", function () { // quando muda o select de pagamento
    let forma = this.value; // pega a opção escolhida (pix, cartao, boleto)
    let dados = document.getElementById("dados-pagamento"); // div onde aparecem os campos extras

    if (forma === "pix") { // se escolheu pix
        dados.innerHTML = `
            <h3>Pagamento via PIX</h3>
            <p>Chave demonstrativa: biocosmetics@email.com</p>
            <p>Valor: ${document.getElementById("total").textContent}</p>
            <p>Pagamento simulado para demonstração.</p>
        `; // mostra os dados fake de pix
    } else if (forma === "cartao") { // se escolheu cartão de crédito
        dados.innerHTML = `
            <h3>Cartão de crédito</h3>
            <input type="text" id="nome-cartao" placeholder="Nome do titular">
            <input type="text" id="numero-cartao" placeholder="Número do cartão">
            <input type="text" id="validade" placeholder="Validade (MM/AA)">
            <input type="text" id="cvv" placeholder="CVV">
            <p>Use apenas dados fictícios nesta demonstração.</p>
        `; // renderiza inputs do cartão
    } else if (forma === "boleto") { // se escolheu boleto
        dados.innerHTML = `
            <h3>Pagamento via boleto</h3>
            <p>Boleto demonstrativo</p>
            <p>12345.67890 12345.678901</p>
            <p>Este código não é válido para pagamento.</p>
        `; // renderiza info do boleto
    } else { // se voltou pra "Selecione"
        dados.innerHTML = ""; // limpa os campos extras
    } // fecha else
}); // fecha listener forma-pagamento


// BUSCAR CLIENTE E ENDEREÇO PELO CPF
let idClienteAtual = null; // guarda o id_cliente achado pelo cpf
let temEnderecoCadastrado = false; // marca se o cliente já tem endereço salvo no banco

document.getElementById("cpf").addEventListener("input", async function () { // dispara enquanto digita o cpf
    const cpf = this.value.replace(/\D/g, "").trim(); // tira pontos/traços e deixa só número

    if (cpf.length !== 11) { // cpf só tem 11 dígitos
        idClienteAtual = null; // reseta o id atual
        temEnderecoCadastrado = false; // reseta flag de endereço
        return; // espera completar os 11 números
    } // fecha if tamanho cpf

    try { // tenta consultar cliente e endereço na api
        const resp = await fetch("http://localhost:3000/clientes"); // busca todos os clientes
        const clientes = await resp.json(); // converte pra array
        const clienteEncontrado = clientes.find( // procura o cliente com esse cpf
            c => String(c.cpf).replace(/\D/g, "") === cpf // compara só os dígitos limpos
        ); // fecha find

        if (!clienteEncontrado) { // se n achou ninguém com esse cpf
            idClienteAtual = null; // limpa id
            temEnderecoCadastrado = false; // limpa flag
            alert("CPF não encontrado no cadastro!"); // avisa o usuário
            return; // para por aqui
        } // fecha if !clienteEncontrado

        idClienteAtual = clienteEncontrado.id_cliente; // salva o id_cliente do banco

        const respEnd = await fetch("http://localhost:3000/enderecos"); // busca os endereços cadastrados
        const enderecos = await respEnd.json(); // converte resposta em json
        const enderecoEncontrado = enderecos.find(e => e.id_cliente === idClienteAtual); // vê se tem endereço desse cliente

        if (enderecoEncontrado) { // se já tinha endereço no banco
            temEnderecoCadastrado = true; // marca q n precisa dar post de endereço depois
            document.getElementById("cep").value = enderecoEncontrado.cep; // preenche o cep
            document.getElementById("rua").value = enderecoEncontrado.rua; // preenche a rua
            document.getElementById("numero").value = enderecoEncontrado.numero; // preenche o número
            document.getElementById("cidade").value = enderecoEncontrado.cidade; // preenche a cidade
        } else { // se ainda n tinha endereço cadastrado
            temEnderecoCadastrado = false; // marca q vai precisar cadastrar endereço novo
            document.getElementById("cep").value = ""; // limpa cep
            document.getElementById("rua").value = ""; // limpa rua
            document.getElementById("numero").value = ""; // limpa número
            document.getElementById("cidade").value = ""; // limpa cidade
        } // fecha else
    } catch (erro) { // se der erro na requisição
        console.error("Erro ao buscar cliente/endereço:", erro); // loga o erro no console
    } // fecha catch
}); // fecha listener cpf


// CONFIRMAR PAGAMENTO (SALVA ENDEREÇO + PEDIDO + ITENS + NOTA FISCAL)
document.getElementById("confirmar-pagamento").addEventListener("click", async function () { // clique em confirmar pedido
    const forma = document.getElementById("forma-pagamento").value; // pega forma de pagamento
    const cep = document.getElementById("cep").value.trim(); // pega cep digitado
    const rua = document.getElementById("rua").value.trim(); // pega rua digitada
    const numero = document.getElementById("numero").value.trim(); // pega número digitado
    const cidade = document.getElementById("cidade").value.trim(); // pega cidade digitada

    if (forma === "") { // valida se escolheu forma de pagamento
        alert("Escolha uma forma de pagamento!"); // avisa o usuário
        return; // para aqui
    } // fecha if forma

    if (forma === "cartao") { // se for cartão, valida os campos dele
        const nome = document.getElementById("nome-cartao").value.trim(); // nome no cartão
        const numCartao = document.getElementById("numero-cartao").value.trim(); // número do cartão
        const validade = document.getElementById("validade").value.trim(); // validade
        const cvv = document.getElementById("cvv").value.trim(); // código de segurança

        if (!nome || !numCartao || !validade || !cvv) { // se faltar algum campo do cartão
            alert("Preencha todos os campos do cartão!"); // avisa o usuário
            return; // bloqueia o envio
        } // fecha if campos cartão
    } // fecha if cartao

    if (!idClienteAtual) { // garante q um cpf válido foi resolvido
        alert("Digite um CPF válido e cadastrado!"); // pede cpf válido
        return; // sai da função
    } // fecha if idClienteAtual

    if (!cep || !rua || !numero || !cidade) { // valida endereço completo
        alert("Preencha todos os campos do endereço de entrega!"); // avisa sobre os campos vazios
        return; // para aqui
    } // fecha if endereço

    const totalPedido = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0); // calcula o total do pedido

    try { // tenta gravar tudo no banco em sequência
        if (!temEnderecoCadastrado) { // só cria endereço se o cliente ainda n tinha
            await fetch("http://localhost:3000/enderecos", { // manda post pra tabela endereco
                method: "POST", // método de criação
                headers: { "Content-Type": "application/json" }, // formato json
                body: JSON.stringify({ // payload do endereço
                    id_cliente: idClienteAtual, // liga ao cliente
                    rua: rua, // rua
                    numero: numero, // número
                    cidade: cidade, // cidade
                    cep: cep // cep
                }) // fecha stringify
            }); // fecha fetch endereço
        } // fecha if !temEnderecoCadastrado

        const respPedido = await fetch("http://localhost:3000/pedidos", { // cria o pedido na tabela pedido
            method: "POST", // método post
            headers: { "Content-Type": "application/json" }, // cabeçalho json
            body: JSON.stringify({ // dados do pedido
                id_cliente: idClienteAtual, // cliente q comprou
                valor_total: totalPedido, // valor total calculado
                status: "Pago" // status inicial do pedido
            }) // fecha stringify
        }); // fecha fetch pedido
        const pedidoCriado = await respPedido.json(); // lê o retorno da criação do pedido

        let idPedido = pedidoCriado.id_pedido || pedidoCriado.id || pedidoCriado.insertId; // tenta pegar o id do pedido criado
        if (!idPedido) { // se n veio na resposta direta do post
            const listaPedidos = await (await fetch("http://localhost:3000/pedidos")).json(); // busca todos os pedidos
            const pedidosDoCliente = listaPedidos.filter(p => p.id_cliente === idClienteAtual); // filtra os desse cliente
            idPedido = pedidosDoCliente[pedidosDoCliente.length - 1].id_pedido; // pega o último pedido criado dele
        } // fecha if !idPedido

        for (const item of carrinho) { // salva cada item do carrinho em item_pedido
            await fetch("http://localhost:3000/itens-pedido", { // envia item por item
                method: "POST", // método post
                headers: { "Content-Type": "application/json" }, // json
                body: JSON.stringify({ // dados do item do pedido
                    id_pedido: idPedido, // id do pedido pai
                    id_produto: item.id, // id do produto comprado
                    quantidade: item.quantidade, // qtd comprada
                    preco_unitario: item.preco // preço unitário na hora da compra
                }) // fecha stringify
            }); // fecha fetch item_pedido
        } // fecha for itens

        const numeroNota = "NF-" + Date.now(); // gera um número simples de nota fiscal
        await fetch("http://localhost:3000/notas-fiscais", { // grava a nota na tabela nota_fiscal
            method: "POST", // método post
            headers: { "Content-Type": "application/json" }, // json
            body: JSON.stringify({ // dados da nota fiscal
                id_pedido: idPedido, // vincula ao pedido
                numero_nota: numeroNota, // número gerado
                valor_total: totalPedido // valor total da nota
            }) // fecha stringify
        }); // fecha fetch nota_fiscal

        alert(`Pedido #${idPedido} confirmado com sucesso!\nNota Fiscal emitida: ${numeroNota}`); // mostra confirmação pro cliente

        for (const item of carrinho) { // limpa os itens da tabela carrinho no banco
            if (item.id_carrinho) { // só se o item tinha registro na tabela carrinho
                await fetch(`http://localhost:3000/carrinhos/${item.id_carrinho}`, { // deleta o item do carrinho no sql
                    method: "DELETE" // método delete
                }); // fecha fetch delete
            } // fecha if id_carrinho
        } // fecha for limpar carrinho

        carrinho = []; // zera o carrinho na memória
        mostrarCarrinho(); // atualiza a tela mostrando carrinho vazio

        document.getElementById("pagamento").style.display = "none"; // esconde a área de pagamento
        document.getElementById("forma-pagamento").value = ""; // reseta o select de pagamento
        document.getElementById("dados-pagamento").innerHTML = ""; // limpa os campos extras de pagamento
        window.location.hash = "inicio"; // volta o foco pro topo/início
    } catch (erro) { // se algum fetch da compra falhou
        console.error("Erro ao finalizar pedido:", erro); // mostra erro no console
        alert("Erro ao registrar pedido no servidor. Olhe o console (F12)."); // avisa o usuário
    } // fecha catch
}); // fecha listener confirmar-pagamento


// CARROSSEL
let slideAtual = 0; // índice do slide ativo no momento
let intervaloSlide; // guarda o setInterval da troca automática

function mostrarSlide(numero) { // exibe o slide correspondente ao número passado
    let slides = document.querySelectorAll(".slide"); // pega todos os slides
    let pontos = document.querySelectorAll(".ponto"); // pega as bolinhas indicadoras

    slides.forEach(slide => slide.classList.remove("anterior-slide")); // limpa classe de transição antiga

    slides[slideAtual].classList.remove("ativo"); // desativa slide atual
    slides[slideAtual].classList.add("anterior-slide"); // marca ele como anterior pra transição
    pontos[slideAtual].classList.remove("ativo"); // desativa bolinha atual

    slideAtual = (numero + slides.length) % slides.length; // calcula o próximo índice circularmente

    slides[slideAtual].classList.remove("anterior-slide"); // garante q o novo n tenha classe antiga
    slides[slideAtual].classList.add("ativo"); // ativa o novo slide
    pontos[slideAtual].classList.add("ativo"); // destaca a bolinha correspondente

    clearInterval(intervaloSlide); // reinicia o timer automático
    intervaloSlide = setInterval(function () { // agenda próxima troca em 5s
        mudarSlide(1); // avança um slide
    }, 5000); // 5000ms = 5 segundos
} // fecha mostrarSlide

function mudarSlide(direcao) { // avança (-1 ou +1) nos slides
    mostrarSlide(slideAtual + direcao); // chama mostrarSlide com o novo índice
} // fecha mudarSlide

intervaloSlide = setInterval(function () { // inicia o carrossel automático ao abrir a página
    mudarSlide(1); // passa pro próximo slide
}, 5000); // a cada 5 segundos


// VERIFICAR LOGIN
function verificarLogin() { // ajusta o header conforme o estado de login
    const clienteSalvo = localStorage.getItem("clienteLogado"); // busca sessão salva
    const botaoCadastrar = document.querySelector('nav a[href="signup.html"]'); // link de cadastrar
    const botaoEntrar = document.querySelector('nav a[href="login.html"]'); // link de entrar
    const botaoCarrinho = document.querySelector('nav a[href="#carrinho"]'); // link de carrinho no nav

    if (clienteSalvo) { // se o usuário tá logado
        const cliente = JSON.parse(clienteSalvo); // converte dados do cliente

        if (botaoCadastrar) { // se o botão cadastrar existir no header
            botaoCadastrar.style.display = "none"; // esconde pq já tá logado
        } // fecha if botaoCadastrar

        if (botaoEntrar) { // se o botão entrar existir
            const primeiroNome = cliente.nome ? cliente.nome.split(" ")[0] : "Cliente"; // pega só o primeiro nome
            botaoEntrar.style.gap = "8px"; // espaço entre foto e texto

            botaoEntrar.innerHTML = `
                <img src="assets/imgs/defaultpfp.jpg" alt="Perfil" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover;">
                <span>Olá, ${primeiroNome} (Sair)</span>
            `; // troca o texto "ENTRAR" pela foto + nome + sair

            botaoEntrar.addEventListener("click", function (event) { // clique pra deslogar
                event.preventDefault(); // evita navegar pro login.html
                localStorage.removeItem("clienteLogado"); // apaga a sessão salva
                window.location.reload(); // recarrega a página atualizada
            }); // fecha listener logout
        } // fecha if botaoEntrar
    } else { // se não estiver logado
        if (botaoCarrinho) { // se houver o link de carrinho no menu
            botaoCarrinho.addEventListener("click", function (event) { // intercepta clique no carrinho
                event.preventDefault(); // impede ir direto pro #carrinho
                alert("Faça login para acessar o carrinho!"); // avisa q precisa logar
                window.location.href = "login.html"; // manda pro login
            }); // fecha listener botaoCarrinho
        } // fecha if botaoCarrinho
    } // fecha else
} // fecha verificarLogin


// INICIAR SITE
verificarLogin(); // checa login assim q carrega o script
mostrarCarrinho(); // renderiza o estado inicial do carrinho
carregarProdutos(); // busca os produtos do banco e já carrega o carrinho salvo

    if (produtos.length === 0) {
        lista.innerHTML = "<p>Nenhum produto cadastrado no momento.</p>";
        return;
    }

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
        const resp = await fetch("http://localhost:3000/carrinhos");
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}`);
        }

        const todosCarrinhos = await resp.json();
        const itensDoCliente = todosCarrinhos.filter(c => c.id_cliente === cliente.id_cliente);

        carrinho = itensDoCliente.map(itemBanco => {
            const prod = produtos.find(p => p.id === itemBanco.id_produto);
            return {
                id_carrinho: itemBanco.id_carrinho,
                id: itemBanco.id_produto,
                nome: prod ? prod.nome : "Produto",
                preco: prod ? prod.preco : 0,
                imagem: prod ? prod.imagem : imagemPadrao,
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

    clearTimeout(timersCarrinho[idProduto]);

    timersCarrinho[idProduto] = setTimeout(async () => {
        const itemAtual = carrinho.find(item => item.id === idProduto);

        try {
            if (!itemAtual) {
                if (idCarrinhoAntigo) {
                    await fetch(`http://localhost:3000/carrinhos/${idCarrinhoAntigo}`, {
                        method: "DELETE"
                    });
                }
                return;
            }

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
            } else {
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
    }, 500);
}


// ADICIONAR AO CARRINHO
function adicionarCarrinho(id) {
    if (!getClienteLogado()) {
        alert("Faça login para adicionar produtos ao carrinho!");
        window.location.href = "login.html";
        return;
    }

    let produto = produtos.find(item => item.id === id);
    if (!produto) return;

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


// MOSTRAR CARRINHO
function mostrarCarrinho() {
    let lista = document.getElementById("lista-carrinho");
    let total = 0;

    lista.innerHTML = "";

    if (carrinho.length === 0) {
        lista.innerHTML = "<p>Seu carrinho está vazio.</p>";
    }

    carrinho.forEach(function (item) {
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
    } else if (forma === "cartao") {
        dados.innerHTML = `
            <h3>Cartão de crédito</h3>
            <input type="text" id="nome-cartao" placeholder="Nome do titular">
            <input type="text" id="numero-cartao" placeholder="Número do cartão">
            <input type="text" id="validade" placeholder="Validade (MM/AA)">
            <input type="text" id="cvv" placeholder="CVV">
            <p>Use apenas dados fictícios nesta demonstração.</p>
        `;
    } else if (forma === "boleto") {
        dados.innerHTML = `
            <h3>Pagamento via boleto</h3>
            <p>Boleto demonstrativo</p>
            <p>12345.67890 12345.678901</p>
            <p>Este código não é válido para pagamento.</p>
        `;
    } else {
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

    const totalPedido = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);

    try {
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

        let idPedido = pedidoCriado.id_pedido || pedidoCriado.id || pedidoCriado.insertId;
        if (!idPedido) {
            const listaPedidos = await (await fetch("http://localhost:3000/pedidos")).json();
            const pedidosDoCliente = listaPedidos.filter(p => p.id_cliente === idClienteAtual);
            idPedido = pedidosDoCliente[pedidosDoCliente.length - 1].id_pedido;
        }

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

        const numeroNota = "NF-" + Date.now();
        await fetch("http://localhost:3000/notas-fiscais", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_pedido: idPedido,
                numero_nota: numeroNota,
                valor_total: totalPedido
            })
        });

        alert(`Pedido #${idPedido} confirmado com sucesso!\nNota Fiscal emitida: ${numeroNota}`);

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

    slides.forEach(slide => slide.classList.remove("anterior-slide"));

    slides[slideAtual].classList.remove("ativo");
    slides[slideAtual].classList.add("anterior-slide");
    pontos[slideAtual].classList.remove("ativo");

    slideAtual = (numero + slides.length) % slides.length;

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

intervaloSlide = setInterval(function () {
    mudarSlide(1);
}, 5000);


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

        if (botaoEntrar) {
            const primeiroNome = cliente.nome ? cliente.nome.split(" ")[0] : "Cliente";
            botaoEntrar.style.gap = "8px";

            botaoEntrar.innerHTML = `
                <img src="assets/imgs/defaultpfp.jpg" alt="Perfil" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover;">
                <span>Olá, ${primeiroNome} (Sair)</span>
            `;

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


// INICIAR SITE
verificarLogin();
mostrarCarrinho();
carregarProdutos();