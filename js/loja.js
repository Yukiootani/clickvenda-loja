// js/loja.js - Versão com Checkout
import { db, collection, getDocs, addDoc } from './firebase.js'; // Adicionamos addDoc aqui

const listaProdutos = document.getElementById('lista-produtos');
const cartContainer = document.getElementById('cart-items-container');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cont-carrinho');

let carrinho = [];

const formatarDinheiro = (val) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(val);

async function carregarLoja() {
    try {
        const querySnapshot = await getDocs(collection(db, "produtos"));
        listaProdutos.innerHTML = '';

        if (querySnapshot.empty) {
            listaProdutos.innerHTML = '<p>Loja vazia.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const produto = doc.data();
            const id = doc.id;
            
            const cartao = document.createElement('div');
            cartao.className = 'card';
            cartao.innerHTML = `
                <div class="img-box">${produto.foto ? `<img src="${produto.foto}">` : '📷'}</div>
                <div class="info">
                    <div class="nome">${produto.nome}</div>
                    <div class="preco">${formatarDinheiro(produto.preco)}</div>
                    <button class="btn-comprar" id="btn-${id}">ADICIONAR +</button>
                </div>
            `;
            listaProdutos.appendChild(cartao);

            document.getElementById(`btn-${id}`).addEventListener('click', () => {
                adicionarAoCarrinho(produto);
            });
        });

    } catch (error) {
        console.error("Erro:", error);
    }
}

function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    renderizarCarrinho();
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('overlay').classList.add('open');
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    renderizarCarrinho();
}

function renderizarCarrinho() {
    cartCountEl.innerText = carrinho.length;
    cartContainer.innerHTML = '';
    
    if (carrinho.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; color:#999;">Carrinho vazio.</p>';
        cartTotalEl.innerText = formatarDinheiro(0);
        return;
    }

    let total = 0;
    carrinho.forEach((item, index) => {
        total += item.preco;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="item-info"><strong>${item.nome}</strong><br>${formatarDinheiro(item.preco)}</div>
            <div class="item-remove" id="remove-${index}">Remover</div>
        `;
        cartContainer.appendChild(itemDiv);
        document.getElementById(`remove-${index}`).addEventListener('click', () => removerDoCarrinho(index));
    });

    cartTotalEl.innerText = formatarDinheiro(total);
}

// --- FUNÇÃO NOVA: FINALIZAR PEDIDO ---
// Trocamos o alerta por uma gravação no banco de dados
window.finalizarCompra = async () => {
    if(carrinho.length === 0) return alert("Carrinho vazio!");

    const btn = document.querySelector('.btn-checkout');
    btn.innerText = "Enviando Pedido...";
    btn.disabled = true;

    try {
        // Calcula o total
        const totalPedido = carrinho.reduce((acc, item) => acc + item.preco, 0);

        // Salva na coleção "pedidos"
        await addDoc(collection(db, "pedidos"), {
            itens: carrinho,
            total: totalPedido,
            data: new Date(),
            status: "pendente", // O dono vai ver isso amarelo
            cliente: "Cliente Teste PC" // Depois pegaremos o nome real
        });

        alert("✅ Pedido realizado com sucesso! O dono da loja recebeu.");
        carrinho = []; // Limpa carrinho
        renderizarCarrinho();
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('open');

    } catch (erro) {
        alert("Erro ao enviar: " + erro.message);
    }

    btn.innerText = "FINALIZAR COMPRA";
    btn.disabled = false;
};

carregarLoja();