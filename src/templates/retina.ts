export const retina = `
<h1>Retinal Receptive Field Lab</h1>
<p class="subtitle">Probe how ON-center/OFF-surround retinal ganglion cells transform light patterns into contrast-sensitive signals.</p>

<div class="form-grid">
{% for p in params %}
  <div>
    <label for="{{ p.key }}">{{ p.label }}{% if p.unit %} ({{ p.unit }}){% endif %}</label>
    <input
      type="number"
      id="{{ p.key }}"
      name="{{ p.key }}"
      value="{{ p.default }}"
      step="{{ p.step }}"
      min="{{ p.min }}"
      max="{{ p.max }}"
      class="param-input">
  </div>
{% endfor %}
  <div>
    <label for="stimulusType">Stimulus Type</label>
    <select id="stimulusType" name="stimulusType" class="param-input">
    {% for option in stimulusTypes %}
      <option value="{{ option.value }}"{% if option.value == option.default %} selected{% endif %}>{{ option.label }}</option>
    {% endfor %}
    </select>
  </div>
</div>

<div style="margin:.9rem 0 1.1rem 0">
  <button id="retina-btn" onclick="simulateRetina()">Simulate Retina</button>
  <span class="spinner" id="spinner"></span>
  <span id="meta" style="margin-left:.85rem;color:var(--dim);font-size:.85rem"></span>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1rem">
  <div class="chart-box">
    <h2>Receptive Field</h2>
    <svg id="field-map" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
      <text x="170" y="170" text-anchor="middle" fill="#6b7f99" font-size="12">Press Simulate Retina</text>
    </svg>
  </div>
  <div class="chart-box">
    <h2>Stimulus</h2>
    <svg id="stimulus-map" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
      <text x="170" y="170" text-anchor="middle" fill="#6b7f99" font-size="12">Press Simulate Retina</text>
    </svg>
  </div>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1rem">
  <div class="chart-box">
    <h2>Size Tuning</h2>
    <svg id="size-chart" viewBox="0 0 360 210" xmlns="http://www.w3.org/2000/svg">
      <text x="180" y="105" text-anchor="middle" fill="#6b7f99" font-size="12">Press Simulate Retina</text>
    </svg>
  </div>
  <div class="chart-box">
    <h2>Position Scan</h2>
    <svg id="position-chart" viewBox="0 0 360 210" xmlns="http://www.w3.org/2000/svg">
      <text x="180" y="105" text-anchor="middle" fill="#6b7f99" font-size="12">Press Simulate Retina</text>
    </svg>
  </div>
</div>

<div id="explanation" class="hidden"></div>

<script>
function collectRetinaParams() {
  var params = new URLSearchParams();
  document.querySelectorAll('.param-input').forEach(function(el) {
    params.set(el.name, el.value);
  });
  return params;
}

function centerSurroundColor(value, maxAbs) {
  var norm = maxAbs <= 0 ? 0.5 : Math.max(0, Math.min(1, (value / maxAbs + 1) / 2));
  var hue = 220 - 220 * norm;
  var sat = 55 + 30 * Math.abs(norm - 0.5) * 2;
  var light = 16 + 40 * Math.abs(value) / Math.max(maxAbs, 0.001);
  return 'hsl(' + hue.toFixed(1) + ' ' + sat.toFixed(1) + '% ' + light.toFixed(1) + '%)';
}

function stimulusColor(value) {
  if (value > 0) return '#ffd166';
  if (value < 0) return '#7c4dff';
  return '#0f1729';
}

function drawMatrix(svgId, points, mode) {
  var svg = document.getElementById(svgId);
  var W = 340, H = 340, pad = 18;
  var xs = points.map(function(point) { return point.x; });
  var ys = points.map(function(point) { return point.y; });
  var minX = Math.min.apply(null, xs);
  var maxX = Math.max.apply(null, xs);
  var minY = Math.min.apply(null, ys);
  var maxY = Math.max.apply(null, ys);
  var cols = maxX - minX + 1;
  var rows = maxY - minY + 1;
  var cellW = (W - pad * 2) / Math.max(cols, 1);
  var cellH = (H - pad * 2) / Math.max(rows, 1);
  var maxAbs = 0.1;
  var html = '';

  points.forEach(function(point) {
    maxAbs = Math.max(maxAbs, Math.abs(point.value));
  });

  html += '<rect x="' + pad + '" y="' + pad + '" width="' + (W - pad * 2) + '" height="' + (H - pad * 2) + '" rx="8" fill="#0d1424" stroke="#1e2d4a"/>';

  points.forEach(function(point) {
    var x = pad + (point.x - minX) * cellW;
    var y = pad + (maxY - point.y) * cellH;
    var fill = mode === 'field' ? centerSurroundColor(point.value, maxAbs) : stimulusColor(point.value);
    html += '<rect x="' + x.toFixed(2) + '" y="' + y.toFixed(2) + '" width="' + (cellW + 0.4).toFixed(2) + '" height="' + (cellH + 0.4).toFixed(2) + '" fill="' + fill + '"/>';
  });

  var zeroX = pad + (0 - minX + 0.5) * cellW;
  var zeroY = pad + (maxY - 0 + 0.5) * cellH;
  html += '<line x1="' + zeroX.toFixed(2) + '" y1="' + pad + '" x2="' + zeroX.toFixed(2) + '" y2="' + (H - pad) + '" stroke="rgba(200,214,229,0.18)" stroke-dasharray="4"/>';
  html += '<line x1="' + pad + '" y1="' + zeroY.toFixed(2) + '" x2="' + (W - pad) + '" y2="' + zeroY.toFixed(2) + '" stroke="rgba(200,214,229,0.18)" stroke-dasharray="4"/>';
  html += '<text x="' + (W - pad) + '" y="16" text-anchor="end" fill="#6b7f99" font-size="10">' + (mode === 'field' ? 'center positive, surround negative' : 'bright positive, dark negative') + '</text>';

  svg.innerHTML = html;
}

function drawCurve(svgId, points, color, xLabel) {
  var svg = document.getElementById(svgId);
  var W = 360, H = 210, pad = 26;
  var minX = points[0].x;
  var maxX = points[points.length - 1].x;
  var maxAbs = 0.1;
  var html = '';

  points.forEach(function(point) {
    maxAbs = Math.max(maxAbs, Math.abs(point.value));
  });

  var xScale = (W - pad * 2) / Math.max(maxX - minX, 1);
  var yScale = (H - 32) / (maxAbs * 2);
  var zeroY = H / 2;

  html += '<line x1="' + pad + '" y1="12" x2="' + pad + '" y2="' + (H - 18) + '" stroke="#1e2d4a"/>';
  html += '<line x1="' + pad + '" y1="' + zeroY.toFixed(2) + '" x2="' + (W - pad) + '" y2="' + zeroY.toFixed(2) + '" stroke="#2b476f"/>';

  for (var i = 0; i < 5; i++) {
    var gx = pad + ((W - pad * 2) / 4) * i;
    html += '<line x1="' + gx.toFixed(2) + '" y1="12" x2="' + gx.toFixed(2) + '" y2="' + (H - 18) + '" stroke="#18243b" stroke-width="0.7"/>';
  }

  var pathD = '';
  points.forEach(function(point, index) {
    var x = pad + (point.x - minX) * xScale;
    var y = zeroY - point.value * yScale;
    pathD += (index === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
  });
  html += '<path d="' + pathD + '" fill="none" stroke="' + color + '" stroke-width="1.7"/>';
  html += '<text x="' + (W - pad) + '" y="18" text-anchor="end" fill="#6b7f99" font-size="10">' + xLabel + '</text>';

  svg.innerHTML = html;
}

function renderRetinaSummary(data) {
  var el = document.getElementById('explanation');
  el.classList.remove('hidden');

  var positivePeak = data.sizeTuning.reduce(function(best, point) {
    return point.value > best.value ? point : best;
  }, data.sizeTuning[0]);

  var html = '';
  html += '<div class="explanation"><h3>Interpretation</h3>';
  html += '<p>Net response ' + data.response.toFixed(3) + '. The strongest spot response occurs near radius ' + positivePeak.x.toFixed(1) + ' with gain ' + positivePeak.value.toFixed(3) + '. ';
  html += 'If the response falls as radius grows, the inhibitory surround is dominating the center.</p></div>';
  html += '<div class="explanation"><h3>Model</h3><p>' + data.explanation.model + '</p><ul>';
  data.explanation.notes.forEach(function(note) { html += '<li>' + note + '</li>'; });
  html += '</ul></div>';
  el.innerHTML = html;
}

async function simulateRetina() {
  var btn = document.getElementById('retina-btn');
  var spinner = document.getElementById('spinner');
  var meta = document.getElementById('meta');
  btn.disabled = true;
  spinner.style.display = 'inline-block';
  meta.textContent = 'Convolving stimulus with center-surround field...';

  try {
    var params = collectRetinaParams();
    var res = await fetch('/retina?' + params.toString());
    var data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || ('Request failed: ' + res.status));
    }

    drawMatrix('field-map', data.receptiveField, 'field');
    drawMatrix('stimulus-map', data.stimulus, 'stimulus');
    drawCurve('size-chart', data.sizeTuning, '#4fc3f7', 'spot radius');
    drawCurve('position-chart', data.positionScan, '#ffd166', 'horizontal position');
    renderRetinaSummary(data);
    meta.textContent = 'Rendered ' + data.receptiveField.length + ' spatial samples for a ' + data.params.stimulusType + ' stimulus.';
  } catch (err) {
    meta.textContent = 'Error: ' + err.message;
  }

  btn.disabled = false;
  spinner.style.display = 'none';
}

simulateRetina();
</script>`;

export const retinaParams = [
	{ key: 'gridSize', label: 'Grid Size', unit: 'cells', default: 29, step: 2, min: 15, max: 41 },
	{ key: 'centerSigma', label: 'Center Sigma', unit: 'cells', default: 2.6, step: 0.1, min: 0.8, max: 8 },
	{ key: 'surroundSigma', label: 'Surround Sigma', unit: 'cells', default: 5.8, step: 0.1, min: 1.4, max: 12 },
	{ key: 'surroundStrength', label: 'Surround Strength', unit: '', default: 0.58, step: 0.01, min: 0.1, max: 1.5 },
	{ key: 'stimulusRadius', label: 'Stimulus Radius', unit: 'cells', default: 4.5, step: 0.1, min: 0.5, max: 12 },
	{ key: 'annulusWidth', label: 'Annulus Width', unit: 'cells', default: 2.5, step: 0.1, min: 0.5, max: 8 },
	{ key: 'stimulusX', label: 'Stimulus X', unit: 'cells', default: 0, step: 0.5, min: -12, max: 12 },
	{ key: 'stimulusY', label: 'Stimulus Y', unit: 'cells', default: 0, step: 0.5, min: -12, max: 12 },
	{ key: 'contrast', label: 'Contrast', unit: '', default: 1, step: 0.1, min: -1, max: 1 },
];

export const retinaStimulusTypes = [
	{ value: 'spot', label: 'Spot', default: 'spot' },
	{ value: 'annulus', label: 'Annulus', default: '' },
	{ value: 'edge', label: 'Edge', default: '' },
];
