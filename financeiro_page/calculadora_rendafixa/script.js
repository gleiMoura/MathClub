
// Configuração das Taxas Atuais (Valores de exemplo baseados no script original)
// Em um app real, estes valores poderiam vir de uma API
const TAXAS_MERCADO = {
    'selic': 14.90, // % a.a.
    'cdi': 14.90,   // % a.a.
    'ipca': 4.12    // % a.a.
};

function verificarTipoPersonalizado() {
    const tipo = document.getElementById('tipoInvestimento').value;
    const divPersonalizada = document.getElementById('divTaxaPersonalizada');

    if (tipo === 'personalizado') {
        divPersonalizada.classList.remove('hidden');
    } else {
        divPersonalizada.classList.add('hidden');
    }
}

function calcularInvestimento() {
    // 1. Coleta de dados
    const invInicial = parseFloat(document.getElementById('investimentoInicial').value) || 0;
    const aporteMensal = parseFloat(document.getElementById('aporteMensal').value) || 0;
    const meses = parseInt(document.getElementById('periodo').value) || 0;
    const tipo = document.getElementById('tipoInvestimento').value;

    if (meses <= 0) {
        alert("Por favor, insira um período válido maior que 0.");
        return;
    }

    // 2. Definição da Taxa Mensal (Lógica do script Python)
    let taxaMensal = 0;
    let taxaAnualExibicao = 0;

    if (tipo === 'personalizado') {
        const taxaAnualInput = parseFloat(document.getElementById('taxaAnualPersonalizada').value);
        if (isNaN(taxaAnualInput)) {
            alert("Por favor, insira a taxa anual personalizada.");
            return;
        }
        taxaAnualExibicao = taxaAnualInput;
        // Fórmula de conversão: (1 + taxa)^(1/12) - 1
        taxaMensal = Math.pow(1 + taxaAnualInput / 100, 1 / 12) - 1;

    } else if (tipo === 'selic' || tipo === 'cdb') { // CDB e Fundo DI usam Selic/CDI como base
        taxaAnualExibicao = TAXAS_MERCADO.selic;
        taxaMensal = Math.pow(1 + TAXAS_MERCADO.selic / 100, 1 / 12) - 1;

    } else if (tipo === 'lci') { // LCI/LCA usam CDI
        taxaAnualExibicao = TAXAS_MERCADO.cdi;
        taxaMensal = Math.pow(1 + TAXAS_MERCADO.cdi / 100, 1 / 12) - 1;

    } else if (tipo === 'poupanca') {
        // Regra da poupança (simplificada conforme script):
        // Se Selic > 8.5%, rende 0.5% a.m. + TR (TR ignorada no script base)
        // Se Selic <= 8.5%, rende 70% da Selic
        if (TAXAS_MERCADO.selic > 8.5) {
            taxaMensal = 0.005; // 0.5% a.m.
        } else {
            taxaMensal = Math.pow(1 + (TAXAS_MERCADO.selic * 0.7) / 100, 1 / 12) - 1;
        }
        // Calculando a anual efetiva para exibição
        taxaAnualExibicao = (Math.pow(1 + taxaMensal, 12) - 1) * 100;
    }

    // 3. Loop de Cálculo (Juros Compostos com Aporte Mensal)
    let montante = invInicial;

    // O script Python considera o aporte no final do mês após o rendimento
    // montante *= (1 + taxa)
    // montante += aporte

    for (let i = 0; i < meses; i++) {
        montante = montante * (1 + taxaMensal);
        montante = montante + aporteMensal;
    }

    // 4. Totais
    const totalInvestido = invInicial + (aporteMensal * meses);
    const totalRendimento = montante - totalInvestido;

    // 5. Exibição
    const formatarMoeda = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    document.getElementById('resTotalInvestido').textContent = formatarMoeda(totalInvestido);
    document.getElementById('resRendimentos').textContent = formatarMoeda(totalRendimento);
    document.getElementById('resMontanteFinal').textContent = formatarMoeda(montante);

    document.getElementById('resTaxaMensal').textContent = (taxaMensal * 100).toFixed(2) + "%";
    document.getElementById('resTaxaAnual').textContent = taxaAnualExibicao.toFixed(2) + "%";

    document.getElementById('resultArea').style.display = 'block';
}
