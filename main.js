function calcularINSS(salario) {
    const faixas = [
        { min: 0, max: 1518.00, aliquota: 0.075, deducao: 0 },
        { min: 1518.01, max: 2793.88, aliquota: 0.09, deducao: 22.77 },
        { min: 2793.89, max: 4190.83, aliquota: 0.12, deducao: 106.59 },
        { min: 4190.84, max: 8157.41, aliquota: 0.14, deducao: 190.40 }
    ];

    let inss = 0;
    for (let faixa of faixas) {
        if (salario >= faixa.min && salario <= faixa.max) {
            inss = (salario * faixa.aliquota) - faixa.deducao;
            break;
        }
    }
    return inss;
}

function gerarGrafico() {
    const salarioInput = document.getElementById("salB");
    const resultadoDiv = document.getElementById("resultado");
    
    let salario = parseFloat(salarioInput.value);
    if (isNaN(salario) || salario <= 0) {
        resultadoDiv.innerHTML = "<p style='color:red;'>Por favor, insira um salário válido.</p>";
        return;
    }
    
    let inssCalculado = calcularINSS(salario);
    resultadoDiv.innerHTML = `<p>Valor do INSS: R$ ${inssCalculado.toFixed(2)}</p>`;

    const salarios = [];
    const valoresINSS = [];

    for (let s = 0; s <= 9000; s += 500) {
        if (s > 8157.41) break; // Interrompe quando passa do limite da última faixa
        salarios.push(s);
        valoresINSS.push(calcularINSS(s));
    }

    const ctx = document.getElementById("graficoINSS").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: salarios,
            datasets: [{
                label: "Valor do INSS",
                data: valoresINSS,
                borderColor: "blue",
                fill: false,
                pointBackgroundColor: salarios.map(s => s === salario ? "red" : "blue"),
                pointRadius: salarios.map(s => s === salario ? 6 : 3)
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Salário Bruto" } },
                y: { title: { display: true, text: "Valor do INSS" } }
            }
        }
    });
}
