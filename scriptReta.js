document.getElementById('calcBtn').addEventListener('click', function() {
    const x1 = parseFloat(document.getElementById('x1').value);
    const y1 = parseFloat(document.getElementById('y1').value);
    const x2 = parseFloat(document.getElementById('x2').value);
    const y2 = parseFloat(document.getElementById('y2').value);
  
    if ([x1, y1, x2, y2].some(v => isNaN(v))) {
      alert('Preencha todos os campos com números válidos.');
      return;
    }
    if (x2 === x1) {
      alert('Reta vertical não cabe na forma y = ax + b.');
      return;
    }
  
    const a  = (y2 - y1) / (x2 - x1);
    const b  = y1 - a * x1;
    const xi = -b / a;
    const yi = b;
  
    document.getElementById('function').textContent =
      `f(x) = ${a.toFixed(2)}x + ${b.toFixed(2)}`;
    document.getElementById('xIntercept').textContent =
      `Intercepto em x: (${xi.toFixed(2)}, 0)`;
    document.getElementById('yIntercept').textContent =
      `Intercepto em y: (0, ${yi.toFixed(2)})`;
  
    drawGraph(a, b, [x1, x2, xi], [y1, y2, yi]);
  });
  
  function drawGraph(a, b, xsArr, ysArr) {
    const canvas = document.getElementById('graphCanvas');
    const ctx    = canvas.getContext('2d');
    const w      = canvas.width;
    const h      = canvas.height;
    const pad    = 40;
  
    // limites dinâmicos com margem
    let minX = Math.min(...xsArr, 0) - 1;
    let maxX = Math.max(...xsArr, 0) + 1;
    let minY = Math.min(...ysArr, 0) - 1;
    let maxY = Math.max(...ysArr, 0) + 1;
  
    // funções de escala
    const toX = x => pad + ((x - minX) / (maxX - minX)) * (w - 2 * pad);
    const toY = y => h - pad - ((y - minY) / (maxY - minY)) * (h - 2 * pad);
  
    ctx.clearRect(0, 0, w, h);
  
    // desenha grade
    ctx.font      = '12px Arial';
    ctx.fillStyle = '#555';
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
  
    // passo entre ticks calculado para não gerar muitos rótulos
    const approxLabelWidth = 50; // px
    const approxLabelHeight = 30; // px
  
    const rangeX = maxX - minX;
    const maxLabelsX = Math.floor((w - 2 * pad) / approxLabelWidth);
    const stepX = Math.max(1, Math.ceil(rangeX / maxLabelsX));
  
    const rangeY = maxY - minY;
    const maxLabelsY = Math.floor((h - 2 * pad) / approxLabelHeight);
    const stepY = Math.max(1, Math.ceil(rangeY / maxLabelsY));
  
    // linhas verticais + rótulos X
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x += stepX) {
      const cx = toX(x);
      ctx.beginPath();
      ctx.moveTo(cx, pad);
      ctx.lineTo(cx, h - pad);
      ctx.stroke();
      ctx.fillText(x, cx - 6, h - pad + 16);
    }
  
    // linhas horizontais + rótulos Y
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y += stepY) {
      const cy = toY(y);
      ctx.beginPath();
      ctx.moveTo(pad, cy);
      ctx.lineTo(w - pad, cy);
      ctx.stroke();
      ctx.fillText(y, pad - 30, cy + 4);
    }
  
    // eixos principais
    ctx.strokeStyle = '#000';
    ctx.lineWidth   = 2;
  
    // eixo X (y=0)
    if (minY < 0 && maxY > 0) {
      const y0 = toY(0);
      ctx.beginPath();
      ctx.moveTo(pad, y0);
      ctx.lineTo(w - pad, y0);
      ctx.stroke();
    }
    // eixo Y (x=0)
    if (minX < 0 && maxX > 0) {
      const x0 = toX(0);
      ctx.beginPath();
      ctx.moveTo(x0, h - pad);
      ctx.lineTo(x0, pad);
      ctx.stroke();
    }
  
    // desenha reta
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(toX(minX), toY(a * minX + b));
    ctx.lineTo(toX(maxX), toY(a * maxX + b));
    ctx.stroke();
  
    // destaca interceptos
    const xi = -b / a, yi = b;
    ctx.fillStyle = '#e94e77';
    [ {x: xi, y: 0}, {x: 0, y: yi} ].forEach(pt => {
      ctx.beginPath();
      ctx.arc(toX(pt.x), toY(pt.y), 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText(`(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`,
                   toX(pt.x) + 8, toY(pt.y) - 8);
    });
  }
  
