// js/loja.js - Versão VELOZ (Focada em abrir o Zap)
import { db, collection, getDocs } from './firebase.js';

const listaProdutos = document.getElementById('lista-produtos');
const cartContainer = document.getElementById('cart-items-container');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cont-carrinho');

let carrinho = [];

const formatarDinheiro = (val) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(val);

// --- CARREGAR PRODUTOS (Isso continua usando o Firebase) ---
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

// --- FUNÇÕES DO CARRINHO ---
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

// --- CHECKOUT SIMPLIFICADO (INSTANTÂNEO) ---
window.finalizarCompra = function() {
    if(carrinho.length === 0) return alert("Carrinho vazio!");

    const btn = document.querySelector('.btn-checkout');
    btn.innerText = "Abrindo WhatsApp...";
    
    // 1. Calcula Total
    const totalPedido = carrinho.reduce((acc, item) => acc + item.preco, 0);

    // 2. Monta texto
    let mensagem = "Olá! Gostaria de fazer um pedido:\n\n";
    carrinho.forEach(item => {
        mensagem += `- ${item.nome} (${formatarDinheiro(item.preco)})\n`;
    });
    mensagem += `\n*Total: ${formatarDinheiro(totalPedido)}*`;

    // 3. Redireciona NA HORA (Sem esperar banco de dados)
    const telefoneLoja = "818074558624"; 
    
    // Pequeno atraso visual só pro botão mudar de cor, depois vai
    setTimeout(() => {
        window.location.href = `https://wa.me/${telefoneLoja}?text=${encodeURIComponent(mensagem)}`;
        
        // Limpa depois que o usuário saiu
        carrinho = [];
        renderizarCarrinho();
        btn.innerText = "FINALIZAR COMPRA";
    }, 500);
};

// Inicia
carregarLoja();