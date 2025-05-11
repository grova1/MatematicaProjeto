function GerarGrafico() {
    let capital = parseFloat(document.getElementById("capital").value);
    let aporte = parseFloat(document.getElementById("aporte").value);
    let tempo = parseFloat(document.getElementById("tempo").value);
    let taxaAplicacao = parseFloat(document.getElementById("taxa").value) / 100;
    let ipca = parseFloat(document.getElementById("ipca").value) / 100;

    if (isNaN(capital) || isNaN(aporte) || isNaN(tempo) || isNaN(taxaAplicacao) || isNaN(ipca)) {
        alert("Preencha todos os valores corretamente.");
        return;
    }

    let parcelas = 10;
    let intervalo = tempo / parcelas;
    let labels = [];
    let montantes = [];
    let montantesIPCA = [];

    for (let i = 1; i <= parcelas; i++) {
        let t = intervalo * i;
        let montante, montanteIPCA;

        if (aporte === 0) {
            montante = capital * Math.pow(1 + taxaAplicacao, t);
            montanteIPCA = capital * Math.pow(1 + ipca, t);
        } else {
            let n = Math.floor(t * 12); // meses
            let taxaMensal = Math.pow(1 + taxaAplicacao, 1 / 12) - 1;
            let ipcaMensal = Math.pow(1 + ipca, 1 / 12) - 1;

            montante = capital * Math.pow(1 + taxaMensal, n) +
                       aporte * ((Math.pow(1 + taxaMensal, n) - 1) / taxaMensal);

            montanteIPCA = capital * Math.pow(1 + ipcaMensal, n) +
                           aporte * ((Math.pow(1 + ipcaMensal, n) - 1) / ipcaMensal);
        }

        labels.push(t.toFixed(1)); // Apenas o valor numérico, sem "anos"
        montantes.push(montante);
        montantesIPCA.push(montanteIPCA);
    }

    let resultadoDiv = document.getElementById("resultado");
    let finalMontante = montantes[montantes.length - 1];
    let finalMontanteIPCA = montantesIPCA[montantesIPCA.length - 1];
    let diferencaReal = finalMontante - finalMontanteIPCA;

    resultadoDiv.innerHTML = `
        <p><strong>Montante com taxa de aplicação:</strong> R$ ${finalMontante.toFixed(2)}</p>
        <p><strong>Montante corrigido pela inflação:</strong> R$ ${finalMontanteIPCA.toFixed(2)}</p>
        <p><strong>Diferença real (descontando inflação):</strong> R$ ${diferencaReal.toFixed(2)}</p>
    `;

    let ctx = document.getElementById('graficoInvestimento').getContext('2d');
    if (window.grafico) {
        window.grafico.destroy();
    }

    window.grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Montante com aplicação',
                    data: montantes,
                    borderColor: 'green',
                    fill: false
                },
                {
                    label: 'Montante com IPCA',
                    data: montantesIPCA,
                    borderColor: 'red',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Tempo"
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
