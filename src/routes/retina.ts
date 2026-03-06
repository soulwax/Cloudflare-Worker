/**
 * Retinal Receptive Field Lab
 *
 * Simulates an ON-center/OFF-surround ganglion cell with a difference-of-
 * Gaussians receptive field and reports how it responds to simple stimuli.
 */

type StimulusType = 'spot' | 'annulus' | 'edge';

interface RetinaParams {
	gridSize: number;
	centerSigma: number;
	surroundSigma: number;
	surroundStrength: number;
	stimulusType: StimulusType;
	stimulusRadius: number;
	annulusWidth: number;
	stimulusX: number;
	stimulusY: number;
	contrast: number;
}

interface MatrixPoint {
	x: number;
	y: number;
	value: number;
}

interface CurvePoint {
	x: number;
	value: number;
}

interface RetinaResult {
	params: RetinaParams;
	receptiveField: MatrixPoint[];
	stimulus: MatrixPoint[];
	response: number;
	sizeTuning: CurvePoint[];
	positionScan: CurvePoint[];
	explanation: {
		model: string;
		notes: string[];
	};
}

const DEFAULTS: RetinaParams = {
	gridSize: 29,
	centerSigma: 2.6,
	surroundSigma: 5.8,
	surroundStrength: 0.58,
	stimulusType: 'spot',
	stimulusRadius: 4.5,
	annulusWidth: 2.5,
	stimulusX: 0,
	stimulusY: 0,
	contrast: 1,
};

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 4): number {
	return parseFloat(value.toFixed(digits));
}

function gaussian(distanceSquared: number, sigma: number): number {
	return Math.exp(-distanceSquared / (2 * sigma * sigma));
}

function parseParams(url: URL): RetinaParams {
	const params = { ...DEFAULTS };
	for (const key of Object.keys(DEFAULTS) as (keyof RetinaParams)[]) {
		if (key === 'stimulusType') {
			continue;
		}
		const raw = url.searchParams.get(key);
		if (raw !== null) {
			const parsed = parseFloat(raw);
			if (!isNaN(parsed)) {
				params[key] = parsed;
			}
		}
	}

	const stimulusType = url.searchParams.get('stimulusType');
	if (stimulusType === 'spot' || stimulusType === 'annulus' || stimulusType === 'edge') {
		params.stimulusType = stimulusType;
	}

	params.gridSize = Math.floor(clamp(params.gridSize, 15, 41));
	if (params.gridSize % 2 === 0) {
		params.gridSize += 1;
	}
	params.centerSigma = clamp(params.centerSigma, 0.8, 8);
	params.surroundSigma = clamp(params.surroundSigma, params.centerSigma + 0.5, 12);
	params.surroundStrength = clamp(params.surroundStrength, 0.1, 1.5);
	params.stimulusRadius = clamp(params.stimulusRadius, 0.5, 12);
	params.annulusWidth = clamp(params.annulusWidth, 0.5, 8);
	params.stimulusX = clamp(params.stimulusX, -12, 12);
	params.stimulusY = clamp(params.stimulusY, -12, 12);
	params.contrast = clamp(params.contrast, -1, 1);

	return params;
}

function receptiveFieldValue(x: number, y: number, params: RetinaParams): number {
	const d2 = x * x + y * y;
	return gaussian(d2, params.centerSigma) - params.surroundStrength * gaussian(d2, params.surroundSigma);
}

function stimulusValue(x: number, y: number, params: RetinaParams, radius = params.stimulusRadius, xOffset = params.stimulusX): number {
	const dx = x - xOffset;
	const dy = y - params.stimulusY;
	const distance = Math.sqrt(dx * dx + dy * dy);

	switch (params.stimulusType) {
		case 'spot':
			return distance <= radius ? params.contrast : 0;
		case 'annulus':
			return distance >= radius && distance <= radius + params.annulusWidth ? params.contrast : 0;
		case 'edge':
			return dx >= 0 ? params.contrast : 0;
	}
}

function computeResponse(params: RetinaParams, radius = params.stimulusRadius, xOffset = params.stimulusX): number {
	const half = Math.floor(params.gridSize / 2);
	let total = 0;
	for (let y = -half; y <= half; y++) {
		for (let x = -half; x <= half; x++) {
			total += receptiveFieldValue(x, y, params) * stimulusValue(x, y, params, radius, xOffset);
		}
	}
	return total;
}

function simulate(params: RetinaParams): RetinaResult {
	const half = Math.floor(params.gridSize / 2);
	const receptiveField: MatrixPoint[] = [];
	const stimulus: MatrixPoint[] = [];

	for (let y = -half; y <= half; y++) {
		for (let x = -half; x <= half; x++) {
			receptiveField.push({ x, y, value: round(receptiveFieldValue(x, y, params)) });
			stimulus.push({ x, y, value: round(stimulusValue(x, y, params)) });
		}
	}

	const response = round(computeResponse(params), 5);
	const sizeTuning: CurvePoint[] = [];
	for (let radius = 0.5; radius <= 12; radius += 0.5) {
		sizeTuning.push({ x: round(radius, 2), value: round(computeResponse({ ...params, stimulusType: 'spot' }, radius, 0), 5) });
	}

	const positionScan: CurvePoint[] = [];
	for (let xOffset = -12; xOffset <= 12; xOffset += 0.5) {
		positionScan.push({ x: round(xOffset, 2), value: round(computeResponse(params, params.stimulusRadius, xOffset), 5) });
	}

	return {
		params,
		receptiveField,
		stimulus,
		response,
		sizeTuning,
		positionScan,
		explanation: {
			model: 'A classic difference-of-Gaussians ganglion-cell model approximating ON-center/OFF-surround retinal receptive fields.',
			notes: [
				'Small bright spots excite the ON center, but large spots recruit inhibitory surround and reduce net response.',
				'Annuli can strongly drive the surround and suppress firing, exposing antagonistic center-surround organization.',
				'This is one reason the retina emphasizes contrast and edges rather than raw luminance.',
			],
		},
	};
}

export function handleRetina(request: Request): Response {
	const url = new URL(request.url);
	const params = parseParams(url);
	const result = simulate(params);
	return new Response(JSON.stringify(result, null, 2), {
		headers: { 'Content-Type': 'application/json' },
	});
}
