document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calcular").addEventListener("click", Grafico);
});

function INSS(salarioBruto) {
    if (salarioBruto <= 1412) return salarioBruto * 0.075;
    if (salarioBruto <= 2666.68) return 1412 * 0.075 + (salarioBruto - 1412) * 0.09;
    if (salarioBruto <= 4000.03) return 1412 * 0.075 + (2666.68 - 1412) * 0.09 + (salarioBruto - 2666.68) * 0.12;
    if (salarioBruto <= 7786.02) return 1412 * 0.075 + (2666.68 - 1412) * 0.09 + (4000.03 - 2666.68) * 0.12 + (salarioBruto - 4000.03) * 0.14;
    return 908.86; // Teto do INSS 2025
}

function calcularOIRRF(salarioBruto, dependentes) {
    const deducaoDependente = 189.59;
    const inss = INSS(salarioBruto);
    const baseCalculo = salarioBruto - inss - (dependentes * deducaoDependente);

    const faixas = [
        { limite: 2259.20, aliquota: 0, deducao: 0 },
        { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
        { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
        { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
        { limite: Infinity, aliquota: 0.275, deducao: 896.00 }
    ];

    let imposto = 0;
    let restante = baseCalculo;
    let faixaAnterior = 0;

    for (let i = 1; i < faixas.length; i++) {
        if (baseCalculo > faixas[i - 1].limite) {
            let faixaTributavel = Math.min(baseCalculo, faixas[i].limite) - faixas[i - 1].limite;
            imposto += faixaTributavel * faixas[i].aliquota;
        }
    }

    return { baseCalculo, irrf: Math.max(imposto, 0) };
}

function Grafico() {
    const salarioBruto = parseFloat(document.getElementById("salB").value) || 0;
    const dependentes = parseInt(document.getElementById("NumDep").value) || 0;
    
    const { baseCalculo, irrf } = calcularOIRRF(salarioBruto, dependentes);
    
    document.getElementById("resultado").innerHTML = `
        <p><strong>Base de Cálculo:</strong> R$ ${baseCalculo.toFixed(2)}</p>
        <p><strong>IRRF a Recolher:</strong> R$ ${irrf.toFixed(2)}</p>
    `;
    
    const valoresBase = [2259.20, 2826.65, 3751.05, 4664.68, 6000];
    const valoresIR = valoresBase.map(salario => calcularOIRRF(salario, 0).irrf);
    const valoresIRSemDeducao = valoresBase.map(salario => calcularOIRRF(salario, 0).irrf);
    
    const ctx = document.getElementById("graficoINSS").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: valoresBase.map(v => `R$ ${v.toFixed(2)}`),
            datasets: [
                {
                    label: "IRRF Calculado",
                    data: valoresIR,
                    borderColor: "blue",
                    backgroundColor: "rgba(0, 0, 255, 0.2)",
                    fill: true
                },
                {
                    label: "IRRF Máximo",
                    data: valoresIRSemDeducao,
                    borderColor: "red",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                    fill: true
                },
                {
                    label: "Valor Inserido",
                    data: valoresBase.map(salario => (salario === salarioBruto ? irrf : null)),
                    borderColor: "green",
                    backgroundColor: "green",
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    type: "scatter"
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Valor do IRRF (R$)"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Base de Cálculo (R$)"
                    }
                }
            }
        }
    });
}
