// js/admin.js
import { db, collection, onSnapshot } from './firebase.js';

const listaPedidos = document.getElementById('lista-pedidos');

console.log("Iniciando monitoramento de pedidos...");

// MÁGICA: Isso roda sozinho sempre que entra um pedido novo no banco
onSnapshot(collection(db, "pedidos"), (snapshot) => {
    
    // 1. Limpa a tela para não duplicar
    listaPedidos.innerHTML = "";
    
    // 2. Se não tiver pedidos
    if (snapshot.empty) {
        listaPedidos.innerHTML = "<p>Nenhum pedido ainda.</p>";
        return;
    }

    // 3. Para cada pedido que veio do banco...
    snapshot.forEach(doc => {
        const pedido = doc.data();
        
        // Cria o visual do pedido (HTML)
        const div = document.createElement('div');
        div.className = "pedido-card";
        div.innerHTML = `
            <div>
                <strong>${pedido.cliente}</strong><br>
                <span style="color:#666">${pedido.itens.length} itens</span>
            </div>
            <div style="text-align:right">
                <div style="font-weight:bold">¥ ${pedido.total}</div>
                <span class="status">PENDENTE</span>
            </div>
        `;
        
        // Adiciona na tela
        listaPedidos.appendChild(div);
    });
});