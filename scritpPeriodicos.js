let chartInstance = null;

document.getElementById('calcBtn').addEventListener('click', () => {
  const C0 = parseFloat(document.getElementById('capital').value) || 0;
  const A  = parseFloat(document.getElementById('aporte').value)  || 0;
  const n  = parseInt  (document.getElementById('meses').value)   || 0;
  const r  = (parseFloat(document.getElementById('taxa').value)  || 0) / 100;
  const i  = (parseFloat(document.getElementById('ipca').value)  || 0) / 100;

  const M_inv = C0 * Math.pow(1 + r, n) + A * ((Math.pow(1 + r, n) - 1) / r);
  const M_ipc = C0 * Math.pow(1 + i, n) + A * ((Math.pow(1 + i, n) - 1) / i);

  document.getElementById('montInv').textContent =
    `Montante (taxa aplic.): R$ ${M_inv.toFixed(2)}`;
  document.getElementById('montIPCA').textContent =
    `Montante (IPCA): R$ ${M_ipc.toFixed(2)}`;
  document.getElementById('diferenca').textContent =
    `Diferença: R$ ${(M_inv - M_ipc).toFixed(2)}`;

  // 10 divisões fixas → 11 pontos
  const parts = 10;
  const labels = Array.from({ length: parts + 1 },
    (_, k) => Math.round(k * n / parts)
  );
  const dataInv = labels.map(k =>
    C0 * Math.pow(1 + r, k) + A * ((Math.pow(1 + r, k) - 1) / r)
  );
  const dataIpc = labels.map(k =>
    C0 * Math.pow(1 + i, k) + A * ((Math.pow(1 + i, k) - 1) / i)
  );

  drawChart(labels, dataInv, dataIpc);
});

function drawChart(labels, dataInv, dataIpc) {
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Investimento',
          data: dataInv,
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74,144,226,0.1)',
          fill: true,
          tension: 0.3
        },
        {
          label: 'IPCA',
          data: dataIpc,
          borderColor: '#e94e77',
          backgroundColor: 'rgba(233,78,119,0.1)',
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: false,            // desliga redraw automático
      maintainAspectRatio: true,    
      scales: {
        x: { title: { display: true, text: 'Meses' } },
        y: { title: { display: true, text: 'Valor (R$)' }, beginAtZero: true }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: R$ ${ctx.parsed.y.toFixed(2)}`
          }
        }
      }
    }
  });
}
