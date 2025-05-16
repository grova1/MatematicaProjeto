let chartWithDeduction = null;
let chartWithoutDeduction = null;

document.getElementById('calcBtn').addEventListener('click', () => {
  const sal   = parseFloat(document.getElementById('salario').value)   || 0;
  const deps  = parseInt  (document.getElementById('dependentes').value) || 0;
  const base  = Math.max(0, sal - 189.59 * deps);
  const irCom = calcIRRF(base, true);
  const irSem = calcIRRF(base, false);

  document.getElementById('baseCalc').textContent = `Base de cálculo: R$ ${base.toFixed(2)}`;
  document.getElementById('irrfValue').textContent = `IRRF a recolher: R$ ${irCom.toFixed(2)}`;

  drawChart('chartWithDeduction',  true,  base, irCom,  chartWithDeduction,  c=> chartWithDeduction  = c);
  drawChart('chartWithoutDeduction', false, base, irSem, chartWithoutDeduction, c=> chartWithoutDeduction = c);
});

function calcIRRF(base, useDeduction) {
  const tabela = [
    { min:0,      max:2259.20, aliquota:0.00,   ded:0    },
    { min:2259.21,max:2826.65, aliquota:0.075, ded:169.44 },
    { min:2826.66,max:3751.05, aliquota:0.15,  ded:381.44 },
    { min:3751.06,max:4664.68, aliquota:0.225, ded:662.77 },
    { min:4664.69,max:Infinity,aliquota:0.275, ded:896.00 }
  ];
  const f = tabela.find(f => base >= f.min && base <= f.max);
  const ded = useDeduction ? f.ded : 0;
  return Math.max(0, base * f.aliquota - ded);
}

function drawChart(id, useDeduction, userBase, userIR, oldChart, store) {
  const ctx = document.getElementById(id).getContext('2d');
  if (oldChart) oldChart.destroy();

  const maxBase = 6000, samples = 200;
  const labels = Array.from({length: samples+1},
    (_, i) => +(i * maxBase/samples).toFixed(2)
  );
  const data = labels.map(b => calcIRRF(b, useDeduction));

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: useDeduction ? 'Com dedução' : 'Sem dedução',
        data,
        borderColor: useDeduction ? '#4a90e2' : '#e94e77',
        backgroundColor: 'transparent',
        tension: 0.3,
        borderDash: []        // força linha sólida
      }]
    },
    options: {
      responsive: false,
      scales: {
        x: {
          title: { display: true, text: 'Base de Cálculo (R$)' },
          grid: { borderDash: [] },  // linhas de grade sólidas
          ticks: { maxTicksLimit: 10 }
        },
        y: {
          title: { display: true, text: 'IRRF (R$)' },
          beginAtZero: true,
          grid: { borderDash: [] }   // linhas de grade sólidas
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `R$ ${ctx.parsed.y.toFixed(2)}`
          }
        }
      }
    }
  });

  // destaca o ponto do usuário
  const meta = chart.getDatasetMeta(0);
  const idx = labels.findIndex(b => b >= userBase);
  if (idx >= 0) {
    const pt = meta.data[idx];
    const draw = chart.ctx;
    draw.fillStyle = '#000';
    draw.beginPath();
    draw.arc(pt.x, pt.y, 5, 0, 2*Math.PI);
    draw.fill();
    draw.fillText(`(${userBase.toFixed(2)}, ${userIR.toFixed(2)})`, pt.x+8, pt.y-8);
  }

  store(chart);
}
