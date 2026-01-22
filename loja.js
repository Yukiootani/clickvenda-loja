// --- FUNÇÃO ATUALIZADA: SALVA NO BANCO + MANDA PRO ZAP ---
window.finalizarCompra = async () => {
    if(carrinho.length === 0) return alert("Carrinho vazio!");

    const btn = document.querySelector('.btn-checkout');
    btn.innerText = "Processando...";
    btn.disabled = true;

    try {
        const totalPedido = carrinho.reduce((acc, item) => acc + item.preco, 0);

        // 1. SALVA NO FIREBASE (Para você ter controle)
        await addDoc(collection(db, "pedidos"), {
            itens: carrinho,
            total: totalPedido,
            data: new Date(),
            status: "pendente",
            cliente: "Cliente via WhatsApp"
        });

        // 2. MONTA A MENSAGEM DO WHATSAPP
        let mensagem = "Olá! Gostaria de fazer um pedido:\n\n";
        carrinho.forEach(item => {
            mensagem += `- ${item.nome} (${formatarDinheiro(item.preco)})\n`;
        });
        mensagem += `\n*Total: ${formatarDinheiro(totalPedido)}*`;

        // 3. ABRE O WHATSAPP
        // Substitua pelo SEU número (Ex: 81 para Japão)
        const telefoneLoja = "818074558624"; 
        const linkZap = `https://wa.me/${telefoneLoja}?text=${encodeURIComponent(mensagem)}`;
        
        // Redireciona para o App do Whats
        window.location.href = linkZap;

        // Limpa tudo
        carrinho = [];
        renderizarCarrinho();
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('open');

    } catch (erro) {
        alert("Erro ao enviar: " + erro.message);
    }

    btn.innerText = "FINALIZAR COMPRA";
    btn.disabled = false;
};