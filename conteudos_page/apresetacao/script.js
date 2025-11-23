
// 1. Pegar o parâmetro da URL (ex: ?pasta=poligonos)
const params = new URLSearchParams(window.location.search);
let pastaAtual = params.get('pasta');

// Configuração Padrão (Fallback)
if (!pastaAtual) {
    pastaAtual = 'poligonos';
    console.warn('Nenhuma pasta especificada na URL. Usando padrão: poligonos');
}

// Formatação do título (Substitui hífens E underscores por espaço)
// Ex: "fracoes-mistas" vira "Fracoes mistas"
const tituloFormatado = pastaAtual
    .replace(/-|_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

console.log(`Carregando apresentação para a pasta: ${pastaAtual}`);
// Atualiza o título da página

document.getElementById('titulo-topico').innerText = tituloFormatado;

// Variáveis de controle
let slideAtual = 1;
const imgElement = document.getElementById('slide-img');

// Função para carregar a imagem
function carregarSlide(numero) {
    // === MUDANÇA PRINCIPAL AQUI ===
    // Caminho absoluto partindo da raiz: /conteudos_page/nome-da-pasta/numero.png
    const caminho = `/conteudos_page/images/${pastaAtual}/${numero}.png`;

    console.log(`Tentando carregar: ${caminho}`); // Log para ajudar no debug
    imgElement.src = caminho;

    // Tratamento de erro (imagem não encontrada)
    imgElement.onerror = function () {
        if (numero > 1) {
            // Se não achou a imagem X e X > 1, assumimos que o slide acabou.
            // Volta para o início.
            console.log("Fim dos slides, voltando ao início.");
            slideAtual = 1;
            imgElement.src = `/conteudos_page/${pastaAtual}/${slideAtual}.png`;
        } else {
            // Se falhou logo na imagem 1, o caminho ou a pasta estão errados.
            console.error(`Erro: Não encontrou a imagem 1 em ${caminho}`);
            alert(`Não foi possível encontrar as imagens.\nVerifique se a pasta "/conteudos_page/${pastaAtual}" existe na raiz.`);
        }
    };
}

// Função de navegação
function mudarSlide(direcao) {
    slideAtual += direcao;

    if (slideAtual < 1) {
        slideAtual = 1;
        return;
    }

    carregarSlide(slideAtual);
}

// Inicia carregando o primeiro slide
carregarSlide(slideAtual);

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") mudarSlide(1);
    if (e.key === "ArrowLeft") mudarSlide(-1);
});