// --- FUNÇÃO ATUALIZADA (MODO BLINDADO) ---
window.finalizarCompra = async () => {
    if(carrinho.length === 0) return alert("Carrinho vazio!");

    const btn = document.querySelector('.btn-checkout');
    btn.innerText = "Processando...";
    btn.disabled = true;

    // Calcula o total
    const totalPedido = carrinho.reduce((acc, item) => acc + item.preco, 0);

    // TENTA Salvar no Firebase
    try {
        await addDoc(collection(db, "pedidos"), {
            itens: carrinho,
            total: totalPedido,
            data: new Date(),
            status: "pendente",
            cliente: "Cliente via WhatsApp"
        });
        console.log("✅ Pedido Salvo no Banco!");
    } catch (erro) {
        // Se der erro no banco, ele avisa no console mas NÃO PARA A VENDA
        console.error("Erro ao salvar no banco (mas vamos pro Zap): " + erro.message);
        alert("Atenção: O pedido vai direto pro WhatsApp (Erro de conexão com o banco).");
    }

    // --- PARTE DO WHATSAPP (Agora roda de qualquer jeito) ---
    
    let mensagem = "Olá! Gostaria de fazer um pedido:\n\n";
    carrinho.forEach(item => {
        mensagem += `- ${item.nome} (${formatarDinheiro(item.preco)})\n`;
    });
    mensagem += `\n*Total: ${formatarDinheiro(totalPedido)}*`;

    const telefoneLoja = "818074558624"; // Seu número
    const linkZap = `https://wa.me/${telefoneLoja}?text=${encodeURIComponent(mensagem)}`;
    
    // Abre o WhatsApp
    window.location.href = linkZap;

    // Limpa o botão (caso o cliente volte)
    btn.innerText = "FINALIZAR COMPRA";
    btn.disabled = false;
};