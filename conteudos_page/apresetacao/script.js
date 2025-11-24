// 1. Pegar o parâmetro da URL (ex: ?pasta=poligonos)
const params = new URLSearchParams(window.location.search);
let pastaAtual = params.get('pasta');

// Configuração Padrão (Fallback)
if (!pastaAtual) {
    pastaAtual = 'poligonos';
    console.warn('Nenhuma pasta especificada na URL. Usando padrão: poligonos');
}

// Formatação do título (Substitui hífens E underscores por espaço)
const tituloFormatado = pastaAtual
    .replace(/-|_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

console.log(`Carregando apresentação para a pasta: ${pastaAtual}`);

// Atualiza o título da página
const tituloElement = document.getElementById('titulo-topico');
if (tituloElement) {
    tituloElement.innerText = tituloFormatado;
}

// Variáveis de controle
let slideAtual = 1;
const imgElement = document.getElementById('slide-img');

// === FUNÇÃO AUXILIAR IMPORTANTE ===
// Centraliza a lógica do caminho para evitar erros de digitação e garantir consistência
function getCaminhoImagem(pasta, numero) {
    // Caminho absoluto a partir da raiz do site
    return `/conteudos_page/images/${pasta}/${numero}.png`;
}

// Função para carregar a imagem
function carregarSlide(numero) {
    // Usa a função auxiliar para pegar o caminho
    const caminho = getCaminhoImagem(pastaAtual, numero);

    console.log(`Tentando carregar: ${caminho}`); 
    imgElement.src = caminho;

    // Tratamento de erro (imagem não encontrada)
    imgElement.onerror = function () {
        imgElement.onerror = null; // Remove o listener para evitar loop infinito

        console.warn(`Imagem não encontrada: ${caminho}`);

        // Se o número é maior que 1, assume que a apresentação acabou e volta para o início
        if (numero > 1) {
            console.log("Fim dos slides. Voltando ao início.");
            slideAtual = 1;
            
            // AGORA FUNCIONA: getCaminhoImagem está definida acima
            imgElement.src = getCaminhoImagem(pastaAtual, slideAtual);

            // Se falhar ao carregar a imagem 1, mostra erro crítico
            imgElement.onerror = function () {
                console.error(`Erro Crítico: Não foi possível carregar a imagem 1.`);
                alert(`Erro: A imagem 1.png não foi encontrada na pasta: ${pastaAtual}`);
            };
        } else {
            // Se falhou logo na imagem 1
            console.error(`Erro: Não encontrou a imagem 1 em ${caminho}`);
            alert(`Não foi possível encontrar as imagens.\nVerifique se a pasta "conteudos_page/images/${pastaAtual}" existe e contém o arquivo "1.png".`);
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
if (imgElement) {
    carregarSlide(slideAtual);
} else {
    console.error("Elemento de imagem (id='slide-img') não encontrado no HTML.");
}

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === "ArrowRight") mudarSlide(1);
    if (e.key === "ArrowLeft") mudarSlide(-1);
});