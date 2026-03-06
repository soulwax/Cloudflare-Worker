/**
 * Dopamine Reward Prediction Error Lab
 *
 * Simulates a temporal-difference learning signal over repeated trials,
 * illustrating how dopamine-like prediction errors shift from reward time
 * to cue time and dip below baseline when an expected reward is omitted.
 */

interface DopamineParams {
	durationMs: number;
	dtMs: number;
	trialCount: number;
	cueTime: number;
	rewardTime: number;
	rewardSize: number;
	learningRate: number;
	discount: number;
	traceDecay: number;
	omissionTrial: number;
}

interface TracePoint {
	t: number;
	value: number;
}

interface TrialSnapshot {
	trial: number;
	label: string;
	rewardDelivered: boolean;
	predictionError: TracePoint[];
	valueTrace: TracePoint[];
}

interface LearningPoint {
	trial: number;
	cueError: number;
	rewardError: number;
}

interface DopamineResult {
	params: DopamineParams;
	snapshots: TrialSnapshot[];
	learningCurve: LearningPoint[];
	summary: {
		finalCueResponse: number;
		finalRewardResponse: number;
		omissionDip: number;
		shiftTrial: number | null;
	};
	explanation: {
		model: string;
		notes: string[];
	};
}

const DEFAULTS: DopamineParams = {
	durationMs: 2500,
	dtMs: 25,
	trialCount: 36,
	cueTime: 700,
	rewardTime: 1700,
	rewardSize: 1,
	learningRate: 0.2,
	discount: 0.985,
	traceDecay: 0.92,
	omissionTrial: 28,
};

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 3): number {
	return parseFloat(value.toFixed(digits));
}

function parseParams(url: URL): DopamineParams {
	const params = { ...DEFAULTS };
	for (const key of Object.keys(DEFAULTS) as (keyof DopamineParams)[]) {
		const raw = url.searchParams.get(key);
		if (raw !== null) {
			const parsed = parseFloat(raw);
			if (!isNaN(parsed)) {
				params[key] = parsed;
			}
		}
	}

	params.durationMs = clamp(params.durationMs, 1000, 5000);
	params.dtMs = clamp(params.dtMs, 10, 100);
	params.trialCount = Math.floor(clamp(params.trialCount, 4, 80));
	params.cueTime = clamp(params.cueTime, 100, params.durationMs - 300);
	params.rewardTime = clamp(params.rewardTime, params.cueTime + 100, params.durationMs - 100);
	params.rewardSize = clamp(params.rewardSize, 0.1, 3);
	params.learningRate = clamp(params.learningRate, 0.01, 0.8);
	params.discount = clamp(params.discount, 0.8, 0.999);
	params.traceDecay = clamp(params.traceDecay, 0, 1);
	params.omissionTrial = Math.floor(clamp(params.omissionTrial, 0, params.trialCount));

	return params;
}

function selectSnapshotTrials(params: DopamineParams): Map<number, string> {
	const trials = new Map<number, string>();
	trials.set(1, 'Novel reward');
	trials.set(Math.max(2, Math.ceil(params.trialCount / 2)), 'Mid learning');
	trials.set(params.trialCount, 'Well learned');
	if (params.omissionTrial > 0 && params.omissionTrial <= params.trialCount) {
		trials.set(params.omissionTrial, 'Reward omitted');
	}
	return trials;
}

function eventWindowMetric(trace: TracePoint[], centerMs: number, halfWindowMs: number, mode: 'max' | 'min'): number {
	const start = centerMs - halfWindowMs;
	const end = centerMs + halfWindowMs;
	const points = trace.filter((point) => point.t >= start && point.t <= end);
	if (points.length === 0) {
		return 0;
	}
	return points.reduce((best, point) => {
		return mode === 'max' ? Math.max(best, point.value) : Math.min(best, point.value);
	}, points[0].value);
}

function simulate(params: DopamineParams): DopamineResult {
	const stepCount = Math.floor(params.durationMs / params.dtMs);
	const cueIndex = Math.round(params.cueTime / params.dtMs);
	const rewardIndex = Math.round(params.rewardTime / params.dtMs);
	const values = Array.from({ length: stepCount + 1 }, () => 0);
	const snapshots: TrialSnapshot[] = [];
	const learningCurve: LearningPoint[] = [];
	const snapshotTrials = selectSnapshotTrials(params);

	for (let trial = 1; trial <= params.trialCount; trial++) {
		const rewardDelivered = params.omissionTrial === 0 || trial !== params.omissionTrial;
		const errors: TracePoint[] = [];
		const eligibility = Array.from({ length: stepCount + 1 }, () => 0);

		for (let step = 0; step < stepCount; step++) {
			const currentValue = step < cueIndex ? 0 : values[step];
			const nextValue = step + 1 < cueIndex ? 0 : values[step + 1];
			const reward = rewardDelivered && step === rewardIndex ? params.rewardSize : 0;
			const delta = reward + params.discount * nextValue - currentValue;

			if (step >= cueIndex) {
				for (let idx = cueIndex; idx <= step; idx++) {
					eligibility[idx] *= params.discount * params.traceDecay;
				}
				eligibility[step] += 1;
				for (let idx = cueIndex; idx <= step; idx++) {
					values[idx] += params.learningRate * delta * eligibility[idx];
				}
			}
			errors.push({
				t: round(step * params.dtMs, 2),
				value: round(delta, 4),
			});
		}

		const valueTrace: TracePoint[] = values.slice(0, stepCount).map((value, step) => ({
			t: round(step * params.dtMs, 2),
			value: round(step < cueIndex ? 0 : value, 4),
		}));

		learningCurve.push({
			trial,
			cueError: round(eventWindowMetric(errors, params.cueTime, 80, 'max'), 4),
			rewardError: round(eventWindowMetric(errors, params.rewardTime, 80, rewardDelivered ? 'max' : 'min'), 4),
		});

		if (snapshotTrials.has(trial)) {
			snapshots.push({
				trial,
				label: snapshotTrials.get(trial) ?? `Trial ${trial}`,
				rewardDelivered,
				predictionError: errors,
				valueTrace,
			});
		}
	}

	const finalPoint = learningCurve[learningCurve.length - 1];
	const omissionPoint =
		params.omissionTrial > 0 && params.omissionTrial <= learningCurve.length ? learningCurve[params.omissionTrial - 1] : null;

	let shiftTrial: number | null = null;
	for (const point of learningCurve) {
		if (point.cueError > Math.max(0.02, point.rewardError)) {
			shiftTrial = point.trial;
			break;
		}
	}

	return {
		params,
		snapshots,
		learningCurve,
		summary: {
			finalCueResponse: round(finalPoint?.cueError ?? 0, 4),
			finalRewardResponse: round(finalPoint?.rewardError ?? 0, 4),
			omissionDip: round(omissionPoint?.rewardError ?? 0, 4),
			shiftTrial,
		},
		explanation: {
			model: 'A temporal-difference learning model approximating dopamine reward-prediction error signals described by Wolfram Schultz and colleagues.',
			notes: [
				'At first, an unexpected reward produces a strong positive prediction error at reward time.',
				'With learning, the error shifts earlier toward the predictive cue as value propagates backward in time.',
				'If reward is omitted after expectation has formed, prediction error becomes negative around the expected reward time.',
			],
		},
	};
}

export function handleDopamine(request: Request): Response {
	const url = new URL(request.url);
	const params = parseParams(url);
	const result = simulate(params);
	return new Response(JSON.stringify(result, null, 2), {
		headers: { 'Content-Type': 'application/json' },
	});
}
