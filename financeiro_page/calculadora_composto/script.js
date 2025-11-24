function calcularJurosCompostos() {
    // 1. Obter os valores dos inputs
    const capital = parseFloat(document.getElementById('capital').value);
    const taxa = parseFloat(document.getElementById('taxa').value);
    const tempo = parseFloat(document.getElementById('tempo').value);

    // 2. Validação simples
    if (isNaN(capital) || isNaN(taxa) || isNaN(tempo)) {
        alert("Por favor, preencha todos os campos com números válidos.");
        return;
    }

    // 3. Lógica de cálculo (Juros Compostos)
    // Fórmula: M = C * (1 + i)^t
    const taxaDecimal = taxa / 100;
    const montanteTotal = capital * Math.pow((1 + taxaDecimal), tempo);

    // O juro é a diferença entre o que você tem no final e o que colocou no início
    const juros = montanteTotal - capital;

    // 4. Formatação para Moeda Brasileira (R$)
    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // 5. Exibir os resultados na tela
    document.getElementById('resCapital').textContent = formatarMoeda(capital);
    document.getElementById('resTaxa').textContent = `${taxa}% ao mês`;
    document.getElementById('resTempo').textContent = `${tempo} meses`;
    document.getElementById('resJuros').textContent = formatarMoeda(juros);
    document.getElementById('resTotal').textContent = formatarMoeda(montanteTotal);

    // 6. Mostrar a div de resultados com animação
    const resultArea = document.getElementById('resultArea');
    resultArea.style.display = 'block';
}