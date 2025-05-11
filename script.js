let investmentChartInstance; 

function calculateInvestments() {
<<<<<<< HEAD
=======
    
>>>>>>> 4b26968b0ff3f58d4488b56990af076db14c4871
    const capitalInicial = parseFloat(document.getElementById("capitalInicial").value);
    const tempo = parseInt(document.getElementById("tempo").value);
    const taxaAplicacao = parseFloat(document.getElementById("taxaAplicacao").value) / 100;
    const taxaIPCA = parseFloat(document.getElementById("taxaIPCA").value) / 100;

<<<<<<< HEAD
    const steps = 10;
    const timeSteps = Array.from({ length: steps }, (_, i) => i * tempo / (steps - 1));

    const montanteAplicacao = timeSteps.map(t => capitalInicial * Math.pow(1 + taxaAplicacao, t));
    const montanteIPCA = timeSteps.map(t => capitalInicial * Math.pow(1 + taxaIPCA, t));

=======
    
    const steps = 10;
    const timeSteps = Array.from({ length: steps }, (_, i) => i * tempo / (steps - 1));

    
    const montanteAplicacao = timeSteps.map(t => capitalInicial * Math.pow(1 + taxaAplicacao, t));
    const montanteIPCA = timeSteps.map(t => capitalInicial * Math.pow(1 + taxaIPCA, t));

    
>>>>>>> 4b26968b0ff3f58d4488b56990af076db14c4871
    const finalAplicacao = montanteAplicacao[montanteAplicacao.length - 1];
    const finalIPCA = montanteIPCA[montanteIPCA.length - 1];
    const diferenca = finalAplicacao - finalIPCA;

<<<<<<< HEAD
=======
    
>>>>>>> 4b26968b0ff3f58d4488b56990af076db14c4871
    document.getElementById("results").innerHTML = `
        <p>Montante final (Taxa de Aplicação): <strong>R$ ${finalAplicacao.toFixed(2)}</strong></p>
        <p>Montante final (IPCA): <strong>R$ ${finalIPCA.toFixed(2)}</strong></p>
        <p>Diferença entre montantes: <strong>R$ ${diferenca.toFixed(2)}</strong></p>
    `;

<<<<<<< HEAD
    const ctx = document.getElementById("investmentChart").getContext("2d");

    if (investmentChartInstance) {
        investmentChartInstance.data.labels = timeSteps.map(t => t.toFixed(1)); // removido "anos"
=======

    const ctx = document.getElementById("investmentChart").getContext("2d");

    if (investmentChartInstance) {
        
        investmentChartInstance.data.labels = timeSteps.map(t => t.toFixed(1) + " anos");
>>>>>>> 4b26968b0ff3f58d4488b56990af076db14c4871
        investmentChartInstance.data.datasets[0].data = montanteAplicacao;
        investmentChartInstance.data.datasets[1].data = montanteIPCA;
        investmentChartInstance.update();
    } else {
<<<<<<< HEAD
        investmentChartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: timeSteps.map(t => t.toFixed(1)), // removido "anos"
=======
        
        investmentChartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: timeSteps.map(t => t.toFixed(1) + " anos"),
>>>>>>> 4b26968b0ff3f58d4488b56990af076db14c4871
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
<<<<<<< HEAD
                            text: "Tempo" // alterado aqui
=======
                            text: "Tempo (anos)"
>>>>>>> 4b26968b0ff3f58d4488b56990af076db14c4871
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
