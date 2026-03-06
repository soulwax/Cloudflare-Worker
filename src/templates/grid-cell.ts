export const gridCell = `
<h1>Grid Cell Navigator</h1>
<p class="subtitle">Explore how medial entorhinal cortex neurons tile space with a hexagonal firing lattice during navigation.</p>

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
</div>

<div style="margin:.9rem 0 1.1rem 0">
  <button id="grid-btn" onclick="simulateGridCell()">Generate Grid Field</button>
  <span class="spinner" id="spinner"></span>
  <span id="meta" style="margin-left:.85rem;color:var(--dim);font-size:.85rem"></span>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1rem">
  <div class="chart-box">
    <h2>Arena Path + Spikes</h2>
    <svg id="arena-map" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
      <text x="170" y="170" text-anchor="middle" fill="#6b7f99" font-size="12">Press Generate Grid Field</text>
    </svg>
  </div>
  <div class="chart-box">
    <h2>Firing Rate Map</h2>
    <svg id="heatmap" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
      <text x="170" y="170" text-anchor="middle" fill="#6b7f99" font-size="12">Press Generate Grid Field</text>
    </svg>
  </div>
</div>

<div class="chart-box">
  <h2>Instantaneous Firing Rate</h2>
  <svg id="rate-trace" viewBox="0 0 760 180" xmlns="http://www.w3.org/2000/svg">
    <text x="380" y="90" text-anchor="middle" fill="#6b7f99" font-size="12">Press Generate Grid Field</text>
  </svg>
</div>

<div id="explanation" class="hidden"></div>

<script>
function collectGridParams() {
  var params = new URLSearchParams();
  document.querySelectorAll('.param-input').forEach(function(el) {
    params.set(el.name, el.value);
  });
  return params;
}

function heatColor(value, maxValue) {
  var norm = maxValue <= 0 ? 0 : Math.max(0, Math.min(1, value / maxValue));
  var hue = 210 - 170 * norm;
  var sat = 55 + 35 * norm;
  var light = 14 + 48 * norm;
  return 'hsl(' + hue.toFixed(1) + ' ' + sat.toFixed(1) + '% ' + light.toFixed(1) + '%)';
}

function drawArena(data) {
  var svg = document.getElementById('arena-map');
  var W = 340, H = 340, pad = 20;
  var size = data.params.arenaSize;
  var scale = (W - pad * 2) / size;
  var html = '';

  html += '<rect x="' + pad + '" y="' + pad + '" width="' + (W - pad * 2) + '" height="' + (H - pad * 2) + '" rx="8" fill="#0d1424" stroke="#1e2d4a"/>';

  for (var i = 1; i < 6; i++) {
    var g = pad + ((W - pad * 2) / 6) * i;
    html += '<line x1="' + g.toFixed(2) + '" y1="' + pad + '" x2="' + g.toFixed(2) + '" y2="' + (H - pad) + '" stroke="#18243b" stroke-width="0.7"/>';
    html += '<line x1="' + pad + '" y1="' + g.toFixed(2) + '" x2="' + (W - pad) + '" y2="' + g.toFixed(2) + '" stroke="#18243b" stroke-width="0.7"/>';
  }

  var pathD = '';
  data.path.forEach(function(point, index) {
    var x = pad + point.x * scale;
    var y = H - pad - point.y * scale;
    pathD += (index === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
  });
  html += '<path d="' + pathD + '" fill="none" stroke="rgba(79,195,247,0.35)" stroke-width="1.1"/>';

  data.spikes.forEach(function(spike) {
    var x = pad + spike.x * scale;
    var y = H - pad - spike.y * scale;
    html += '<circle cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="2.2" fill="#ffd166" opacity="0.82"/>';
  });

  if (data.path.length > 0) {
    var start = data.path[0];
    var end = data.path[data.path.length - 1];
    html += '<circle cx="' + (pad + start.x * scale).toFixed(2) + '" cy="' + (H - pad - start.y * scale).toFixed(2) + '" r="4" fill="#00e676"/>';
    html += '<circle cx="' + (pad + end.x * scale).toFixed(2) + '" cy="' + (H - pad - end.y * scale).toFixed(2) + '" r="4" fill="#ff5252"/>';
  }

  svg.innerHTML = html;
}

function drawHeatmap(data) {
  var svg = document.getElementById('heatmap');
  var W = 340, H = 340, pad = 20;
  var map = data.rateMap;
  var rows = map.length;
  var cols = rows ? map[0].length : 0;
  var cellW = (W - pad * 2) / Math.max(cols, 1);
  var cellH = (H - pad * 2) / Math.max(rows, 1);
  var maxValue = 0;
  var html = '';

  map.forEach(function(row) {
    row.forEach(function(value) {
      if (value > maxValue) maxValue = value;
    });
  });

  html += '<rect x="' + pad + '" y="' + pad + '" width="' + (W - pad * 2) + '" height="' + (H - pad * 2) + '" rx="8" fill="#0d1424" stroke="#1e2d4a"/>';

  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      var value = map[y][x];
      var fill = value <= 0 ? '#0f1729' : heatColor(value, maxValue);
      html += '<rect x="' + (pad + x * cellW).toFixed(2) + '" y="' + (pad + y * cellH).toFixed(2) + '" width="' + (cellW + 0.4).toFixed(2) + '" height="' + (cellH + 0.4).toFixed(2) + '" fill="' + fill + '"/>';
    }
  }

  svg.innerHTML = html;
}

function drawRateTrace(data) {
  var svg = document.getElementById('rate-trace');
  var W = 760, H = 180, pad = 24;
  var points = data.path;
  var duration = data.params.durationSec;
  var maxRate = 0;
  points.forEach(function(point) { if (point.rateHz > maxRate) maxRate = point.rateHz; });
  maxRate = Math.max(maxRate, 1);

  var xScale = (W - pad * 2) / Math.max(duration, 1);
  var yScale = (H - 26) / maxRate;
  var html = '';

  html += '<line x1="' + pad + '" y1="10" x2="' + pad + '" y2="' + (H - 16) + '" stroke="#1e2d4a"/>';
  html += '<line x1="' + pad + '" y1="' + (H - 16) + '" x2="' + (W - pad) + '" y2="' + (H - 16) + '" stroke="#1e2d4a"/>';

  for (var t = 0; t <= duration; t += Math.max(5, Math.round(duration / 8))) {
    var gx = pad + t * xScale;
    html += '<line x1="' + gx.toFixed(2) + '" y1="10" x2="' + gx.toFixed(2) + '" y2="' + (H - 16) + '" stroke="#18243b" stroke-width="0.7"/>';
  }

  var pathD = '';
  points.forEach(function(point, index) {
    var x = pad + point.t * xScale;
    var y = H - 16 - point.rateHz * yScale;
    pathD += (index === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
  });
  html += '<path d="' + pathD + '" fill="none" stroke="#4fc3f7" stroke-width="1.5"/>';
  html += '<text x="' + (W - pad) + '" y="18" text-anchor="end" fill="#6b7f99" font-size="10">Peak ' + maxRate.toFixed(1) + ' Hz</text>';

  svg.innerHTML = html;
}

function renderGridSummary(data) {
  var summary = data.summary;
  var explanation = data.explanation;
  var el = document.getElementById('explanation');
  el.classList.remove('hidden');

  var html = '';
  html += '<div class="explanation"><h3>What you are seeing</h3>';
  html += '<p>Spacing ' + summary.spacingCm.toFixed(1) + ' cm, orientation ' + summary.orientationDeg.toFixed(1) + ' degrees, coverage ' + summary.coveragePct.toFixed(1) + '%, mean rate ' + summary.meanRateHz.toFixed(2) + ' Hz, peak rate ' + summary.peakRateHz.toFixed(2) + ' Hz, spikes ' + summary.spikeCount + '.</p>';
  html += '</div>';
  html += '<div class="explanation"><h3>Model</h3><p>' + explanation.model + '</p><ul>';
  explanation.notes.forEach(function(note) { html += '<li>' + note + '</li>'; });
  html += '</ul></div>';
  el.innerHTML = html;
}

async function simulateGridCell() {
  var btn = document.getElementById('grid-btn');
  var spinner = document.getElementById('spinner');
  var meta = document.getElementById('meta');
  btn.disabled = true;
  spinner.style.display = 'inline-block';
  meta.textContent = 'Simulating spatial exploration...';

  try {
    var params = collectGridParams();
    var res = await fetch('/grid-cell?' + params.toString());
    var data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || ('Request failed: ' + res.status));
    }

    drawArena(data);
    drawHeatmap(data);
    drawRateTrace(data);
    renderGridSummary(data);
    meta.textContent = 'Hexagonal field generated from ' + data.path.length + ' samples and ' + data.spikes.length + ' spikes.';
  } catch (err) {
    meta.textContent = 'Error: ' + err.message;
  }

  btn.disabled = false;
  spinner.style.display = 'none';
}

simulateGridCell();
</script>`;

export const gridCellParams = [
	{ key: 'arenaSize', label: 'Arena Size', unit: 'cm', default: 120, step: 5, min: 60, max: 240 },
	{ key: 'durationSec', label: 'Duration', unit: 's', default: 90, step: 5, min: 20, max: 240 },
	{ key: 'dtMs', label: 'Step', unit: 'ms', default: 40, step: 5, min: 20, max: 120 },
	{ key: 'speed', label: 'Speed', unit: 'cm/s', default: 18, step: 1, min: 4, max: 60 },
	{ key: 'spacing', label: 'Grid Spacing', unit: 'cm', default: 32, step: 1, min: 12, max: 80 },
	{ key: 'orientation', label: 'Orientation', unit: 'deg', default: 18, step: 1, min: -90, max: 90 },
	{ key: 'phaseX', label: 'Phase X', unit: 'cm', default: 6, step: 1, min: -120, max: 120 },
	{ key: 'phaseY', label: 'Phase Y', unit: 'cm', default: -4, step: 1, min: -120, max: 120 },
	{ key: 'sharpness', label: 'Field Sharpness', unit: '', default: 1.8, step: 0.1, min: 0.4, max: 4 },
	{ key: 'maxRate', label: 'Max Rate', unit: 'Hz', default: 18, step: 1, min: 2, max: 40 },
	{ key: 'thetaMod', label: 'Theta Mod', unit: '', default: 0.45, step: 0.05, min: 0, max: 1 },
	{ key: 'turnNoise', label: 'Turn Noise', unit: '', default: 0.22, step: 0.01, min: 0.02, max: 0.7 },
];
