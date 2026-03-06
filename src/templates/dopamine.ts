export const dopamine = `
<h1>Dopamine Prediction Error Lab</h1>
<p class="subtitle">Watch reward prediction errors shift from reward delivery to the predictive cue as learning unfolds.</p>

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
  <button id="dopamine-btn" onclick="simulateDopamine()">Simulate Learning</button>
  <span class="spinner" id="spinner"></span>
  <span id="meta" style="margin-left:.85rem;color:var(--dim);font-size:.85rem"></span>
</div>

<div class="chart-box">
  <h2>Prediction Error Across a Trial</h2>
  <svg id="error-chart" viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg">
    <text x="380" y="110" text-anchor="middle" fill="#6b7f99" font-size="12">Press Simulate Learning</text>
  </svg>
</div>

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1rem">
  <div class="chart-box">
    <h2>Value Function</h2>
    <svg id="value-chart" viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <text x="180" y="100" text-anchor="middle" fill="#6b7f99" font-size="12">Press Simulate Learning</text>
    </svg>
  </div>
  <div class="chart-box">
    <h2>Learning Curve</h2>
    <svg id="learning-chart" viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">
      <text x="180" y="100" text-anchor="middle" fill="#6b7f99" font-size="12">Press Simulate Learning</text>
    </svg>
  </div>
</div>

<div id="explanation" class="hidden"></div>

<script>
function collectDopamineParams() {
  var params = new URLSearchParams();
  document.querySelectorAll('.param-input').forEach(function(el) {
    params.set(el.name, el.value);
  });
  return params;
}

function traceColor(index) {
  var colors = ['#4fc3f7', '#ffd166', '#00e676', '#ff6b6b'];
  return colors[index % colors.length];
}

function drawErrorChart(data) {
  var svg = document.getElementById('error-chart');
  var W = 760, H = 220, pad = 28;
  var duration = data.params.durationMs;
  var maxAbs = 0.25;

  data.snapshots.forEach(function(snapshot) {
    snapshot.predictionError.forEach(function(point) {
      maxAbs = Math.max(maxAbs, Math.abs(point.value));
    });
  });

  var xScale = (W - pad * 2) / duration;
  var yScale = (H - 30) / (maxAbs * 2);
  var zeroY = H / 2;
  var html = '';

  html += '<line x1="' + pad + '" y1="12" x2="' + pad + '" y2="' + (H - 18) + '" stroke="#1e2d4a"/>';
  html += '<line x1="' + pad + '" y1="' + zeroY.toFixed(2) + '" x2="' + (W - pad) + '" y2="' + zeroY.toFixed(2) + '" stroke="#2b476f"/>';

  var cueX = pad + data.params.cueTime * xScale;
  var rewardX = pad + data.params.rewardTime * xScale;
  html += '<line x1="' + cueX.toFixed(2) + '" y1="12" x2="' + cueX.toFixed(2) + '" y2="' + (H - 18) + '" stroke="#6b7f99" stroke-dasharray="4"/>';
  html += '<line x1="' + rewardX.toFixed(2) + '" y1="12" x2="' + rewardX.toFixed(2) + '" y2="' + (H - 18) + '" stroke="#6b7f99" stroke-dasharray="4"/>';
  html += '<text x="' + cueX.toFixed(2) + '" y="16" text-anchor="middle" fill="#6b7f99" font-size="10">cue</text>';
  html += '<text x="' + rewardX.toFixed(2) + '" y="16" text-anchor="middle" fill="#6b7f99" font-size="10">reward</text>';

  data.snapshots.forEach(function(snapshot, index) {
    var pathD = '';
    snapshot.predictionError.forEach(function(point, pointIndex) {
      var x = pad + point.t * xScale;
      var y = zeroY - point.value * yScale;
      pathD += (pointIndex === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
    });
    var color = traceColor(index);
    html += '<path d="' + pathD + '" fill="none" stroke="' + color + '" stroke-width="1.6"/>';
    html += '<text x="' + (W - pad) + '" y="' + (28 + index * 14) + '" text-anchor="end" fill="' + color + '" font-size="10">' + snapshot.label + '</text>';
  });

  svg.innerHTML = html;
}

function drawValueChart(data) {
  var svg = document.getElementById('value-chart');
  var W = 360, H = 200, pad = 24;
  var snapshot = data.snapshots[data.snapshots.length - 1];
  var maxValue = 0.1;
  snapshot.valueTrace.forEach(function(point) { maxValue = Math.max(maxValue, point.value); });

  var xScale = (W - pad * 2) / data.params.durationMs;
  var yScale = (H - 26) / maxValue;
  var html = '';

  html += '<line x1="' + pad + '" y1="10" x2="' + pad + '" y2="' + (H - 16) + '" stroke="#1e2d4a"/>';
  html += '<line x1="' + pad + '" y1="' + (H - 16) + '" x2="' + (W - pad) + '" y2="' + (H - 16) + '" stroke="#1e2d4a"/>';

  var pathD = '';
  snapshot.valueTrace.forEach(function(point, index) {
    var x = pad + point.t * xScale;
    var y = H - 16 - point.value * yScale;
    pathD += (index === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
  });
  html += '<path d="' + pathD + '" fill="none" stroke="#00e676" stroke-width="1.6"/>';
  svg.innerHTML = html;
}

function drawLearningChart(data) {
  var svg = document.getElementById('learning-chart');
  var W = 360, H = 200, pad = 24;
  var maxAbs = 0.15;
  data.learningCurve.forEach(function(point) {
    maxAbs = Math.max(maxAbs, Math.abs(point.cueError), Math.abs(point.rewardError));
  });

  var xScale = (W - pad * 2) / Math.max(data.learningCurve.length - 1, 1);
  var yScale = (H - 26) / (maxAbs * 2);
  var zeroY = H / 2;
  var html = '';

  html += '<line x1="' + pad + '" y1="10" x2="' + pad + '" y2="' + (H - 16) + '" stroke="#1e2d4a"/>';
  html += '<line x1="' + pad + '" y1="' + zeroY.toFixed(2) + '" x2="' + (W - pad) + '" y2="' + zeroY.toFixed(2) + '" stroke="#2b476f"/>';

  var cuePath = '';
  var rewardPath = '';
  data.learningCurve.forEach(function(point, index) {
    var x = pad + index * xScale;
    cuePath += (index === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + (zeroY - point.cueError * yScale).toFixed(2);
    rewardPath += (index === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + (zeroY - point.rewardError * yScale).toFixed(2);
  });
  html += '<path d="' + cuePath + '" fill="none" stroke="#ffd166" stroke-width="1.6"/>';
  html += '<path d="' + rewardPath + '" fill="none" stroke="#ff6b6b" stroke-width="1.6"/>';
  html += '<text x="' + (W - pad) + '" y="18" text-anchor="end" fill="#ffd166" font-size="10">cue response</text>';
  html += '<text x="' + (W - pad) + '" y="32" text-anchor="end" fill="#ff6b6b" font-size="10">reward response</text>';

  if (data.params.omissionTrial > 0) {
    var omissionX = pad + (data.params.omissionTrial - 1) * xScale;
    html += '<line x1="' + omissionX.toFixed(2) + '" y1="10" x2="' + omissionX.toFixed(2) + '" y2="' + (H - 16) + '" stroke="#6b7f99" stroke-dasharray="4"/>';
  }

  svg.innerHTML = html;
}

function renderDopamineSummary(data) {
  var summary = data.summary;
  var explanation = data.explanation;
  var el = document.getElementById('explanation');
  el.classList.remove('hidden');

  var html = '';
  html += '<div class="explanation"><h3>Interpretation</h3>';
  html += '<p>Final cue response: ' + summary.finalCueResponse.toFixed(3) + '. Final reward response: ' + summary.finalRewardResponse.toFixed(3) + '. Omission dip: ' + summary.omissionDip.toFixed(3) + '. ';
  html += (summary.shiftTrial ? 'Cue-dominant prediction emerges around trial ' + summary.shiftTrial + '.' : 'Cue-dominant prediction did not surpass reward response in this run.');
  html += '</p></div>';
  html += '<div class="explanation"><h3>Model</h3><p>' + explanation.model + '</p><ul>';
  explanation.notes.forEach(function(note) { html += '<li>' + note + '</li>'; });
  html += '</ul></div>';
  el.innerHTML = html;
}

async function simulateDopamine() {
  var btn = document.getElementById('dopamine-btn');
  var spinner = document.getElementById('spinner');
  var meta = document.getElementById('meta');
  btn.disabled = true;
  spinner.style.display = 'inline-block';
  meta.textContent = 'Running temporal-difference learning...';

  try {
    var params = collectDopamineParams();
    var res = await fetch('/dopamine?' + params.toString());
    var data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || ('Request failed: ' + res.status));
    }

    drawErrorChart(data);
    drawValueChart(data);
    drawLearningChart(data);
    renderDopamineSummary(data);
    meta.textContent = 'Rendered ' + data.learningCurve.length + ' trials and ' + data.snapshots.length + ' snapshot traces.';
  } catch (err) {
    meta.textContent = 'Error: ' + err.message;
  }

  btn.disabled = false;
  spinner.style.display = 'none';
}

simulateDopamine();
</script>`;

export const dopamineParams = [
	{ key: 'durationMs', label: 'Trial Duration', unit: 'ms', default: 2500, step: 50, min: 1000, max: 5000 },
	{ key: 'dtMs', label: 'Time Step', unit: 'ms', default: 25, step: 5, min: 10, max: 100 },
	{ key: 'trialCount', label: 'Trials', unit: '', default: 36, step: 1, min: 4, max: 80 },
	{ key: 'cueTime', label: 'Cue Time', unit: 'ms', default: 700, step: 25, min: 100, max: 4700 },
	{ key: 'rewardTime', label: 'Reward Time', unit: 'ms', default: 1700, step: 25, min: 200, max: 4900 },
	{ key: 'rewardSize', label: 'Reward Size', unit: '', default: 1, step: 0.1, min: 0.1, max: 3 },
	{ key: 'learningRate', label: 'Learning Rate', unit: '', default: 0.2, step: 0.01, min: 0.01, max: 0.8 },
	{ key: 'discount', label: 'Discount', unit: '', default: 0.985, step: 0.001, min: 0.8, max: 0.999 },
	{ key: 'traceDecay', label: 'Trace Decay (lambda)', unit: '', default: 0.92, step: 0.01, min: 0, max: 1 },
	{ key: 'omissionTrial', label: 'Omission Trial', unit: '', default: 28, step: 1, min: 0, max: 80 },
];
