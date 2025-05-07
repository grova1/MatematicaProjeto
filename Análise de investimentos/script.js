let investmentChartInstance; 

function calculateInvestments() {
    
    const capitalInicial = parseFloat(document.getElementById("capitalInicial").value);
    const tempo = parseInt(document.getElementById("tempo").value);
    const taxaAplicacao = parseFloat(document.getElementById("taxaAplicacao").value) / 100;
    const taxaIPCA = parseFloat(document.getElementById("taxaIPCA").value) / 100;

    
    const steps = 10;
    const timeSteps = Array.from({ length: steps }, (_, i) => i * tempo / (steps - 1));

    
    const montanteAplicacao = timeSteps.map(t => capitalInicial * Math.pow(1 + taxaAplicacao, t));
    const montanteIPCA = timeSteps.map(t => capitalInicial * Math.pow(1 + taxaIPCA, t));

    
    const finalAplicacao = montanteAplicacao[montanteAplicacao.length - 1];
    const finalIPCA = montanteIPCA[montanteIPCA.length - 1];
    const diferenca = finalAplicacao - finalIPCA;

    
    document.getElementById("results").innerHTML = `
        <p>Montante final (Taxa de Aplicação): <strong>R$ ${finalAplicacao.toFixed(2)}</strong></p>
        <p>Montante final (IPCA): <strong>R$ ${finalIPCA.toFixed(2)}</strong></p>
        <p>Diferença entre montantes: <strong>R$ ${diferenca.toFixed(2)}</strong></p>
    `;


    const ctx = document.getElementById("investmentChart").getContext("2d");

    if (investmentChartInstance) {
        
        investmentChartInstance.data.labels = timeSteps.map(t => t.toFixed(1) + " anos");
        investmentChartInstance.data.datasets[0].data = montanteAplicacao;
        investmentChartInstance.data.datasets[1].data = montanteIPCA;
        investmentChartInstance.update();
    } else {
        
        investmentChartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: timeSteps.map(t => t.toFixed(1) + " anos"),
                datasets: [
                    {
                        label: "Montante - Taxa de Aplicação",
                        data: montanteAplicacao,
                        borderColor: "blue",
                        fill: false
                    },
                    {
                        label: "Montante - IPCA",
                        data: montanteIPCA,
                        borderColor: "red",
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Tempo (anos)"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Montante (R$)"
                        }
                    }
                }
            }
        });
    }
}
