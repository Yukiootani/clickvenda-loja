// CONSOLE DE EMERGÊNCIA PARA IPHONE
const debugDiv = document.createElement('div');
debugDiv.style = "position:fixed;top:0;left:0;width:100%;background:black;color:lime;font-size:10px;z-index:9999;max-height:100px;overflow:auto;padding:5px;";
debugDiv.innerHTML = "Iniciando Diagnóstico...<br>";
document.body.appendChild(debugDiv);

window.onerror = function(msg, url, line) {
    debugDiv.innerHTML += `❌ ERRO: ${msg} na linha ${line}<br>`;
};

function log(msg) {
    debugDiv.innerHTML += `ℹ️ ${msg}<br>`;
}

// Verifica se o ID da loja chegou
const paramsDebug = new URLSearchParams(window.location.search);
const lojaDebug = paramsDebug.get('loja');
if(!lojaDebug) {
    debugDiv.innerHTML += "⚠️ ALERTA: Nenhuma loja foi detectada na URL!<br>";
} else {
    log("Loja detectada: " + lojaDebug);
}
