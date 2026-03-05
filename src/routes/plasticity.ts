/**
 * Spike-Timing Dependent Plasticity (STDP) Simulation
 *
 * Demonstrates Hebbian learning at the synaptic level:
 * - If presynaptic neuron fires BEFORE postsynaptic -> strengthen (LTP)
 * - If presynaptic neuron fires AFTER postsynaptic  -> weaken (LTD)
 *
 * The timing window is asymmetric and exponential, matching
 * experimental data from Bi & Poo (1998) in hippocampal neurons.
 *
 * STDP window:
 *   dw = A+ * exp(-dt/tau+)  if dt > 0  (pre before post -> LTP)
 *   dw = -A- * exp(dt/tau-)  if dt < 0  (post before pre -> LTD)
 *
 * where dt = t_post - t_pre
 */

interface STDPParams {
	/** LTP amplitude (max weight increase). Typical: 0.005-0.01. */
	aPlus: number;
	/** LTD amplitude (max weight decrease). Typically slightly larger than A+ for stability. */
	aMinus: number;
	/** LTP time constant (ms). How wide the potentiation window is. */
	tauPlus: number;
	/** LTD time constant (ms). */
	tauMinus: number;
	/** Initial synaptic weight. */
	initialWeight: number;
	/** Number of spike pairs to simulate. */
	pairCount: number;
	/** Fixed time difference between pre and post spikes (ms). Negative = post fires first. */
	deltaT: number;
}

interface STDPResult {
	params: STDPParams;
	weightHistory: { pair: number; weight: number; deltaW: number }[];
	finalWeight: number;
	direction: 'LTP' | 'LTD' | 'no change';
	stdpCurve: { dt: number; dw: number }[];
	explanation: {
		hebbianRule: string;
		stdpMechanism: string;
		biologicalBasis: string[];
		connectionToAI: string;
	};
}

const DEFAULTS: STDPParams = {
	aPlus: 0.008,
	aMinus: 0.0085,
	tauPlus: 20,
	tauMinus: 20,
	initialWeight: 0.5,
	pairCount: 60,
	deltaT: 10,
};

function stdpWindow(dt: number, params: STDPParams): number {
	if (dt > 0) {
		// Pre before post -> LTP
		return params.aPlus * Math.exp(-dt / params.tauPlus);
	} else if (dt < 0) {
		// Post before pre -> LTD
		return -params.aMinus * Math.exp(dt / params.tauMinus);
	}
	return 0;
}

function simulate(params: STDPParams): STDPResult {
	const { initialWeight, pairCount, deltaT } = params;

	const weightHistory: { pair: number; weight: number; deltaW: number }[] = [];
	let weight = initialWeight;

	for (let i = 0; i < pairCount; i++) {
		const dw = stdpWindow(deltaT, params);
		weight = Math.max(0, Math.min(1, weight + dw)); // clamp to [0, 1]
		weightHistory.push({ pair: i + 1, weight: parseFloat(weight.toFixed(6)), deltaW: parseFloat(dw.toFixed(6)) });
	}

	// Generate the full STDP curve for visualization
	const stdpCurve: { dt: number; dw: number }[] = [];
	for (let dt = -50; dt <= 50; dt += 1) {
		stdpCurve.push({ dt, dw: parseFloat(stdpWindow(dt, params).toFixed(6)) });
	}

	const direction = deltaT > 0 ? 'LTP' : deltaT < 0 ? 'LTD' : 'no change';

	return {
		params,
		weightHistory,
		finalWeight: parseFloat(weight.toFixed(6)),
		direction,
		stdpCurve,
		explanation: {
			hebbianRule:
				'"Neurons that fire together wire together" (Hebb, 1949). But the modern refinement is STDP: it\'s not just co-firing, it\'s the precise TIMING that matters.',
			stdpMechanism: `With deltaT=${deltaT}ms, the presynaptic neuron fires ${deltaT > 0 ? 'BEFORE' : 'AFTER'} the postsynaptic neuron. ${deltaT > 0 ? 'This means the presynaptic spike might have CAUSED the postsynaptic spike — so the synapse is strengthened (LTP). This is causal learning.' : 'This means the presynaptic spike came too late to have caused the postsynaptic spike — so the synapse is weakened (LTD). The brain is un-learning a non-causal association.'}`,
			biologicalBasis: [
				'NMDA receptors act as coincidence detectors: they require BOTH glutamate binding AND postsynaptic depolarization to open.',
				'When pre fires before post (LTP): glutamate is present when the postsynaptic cell depolarizes, so NMDA receptors open, Ca2+ flows in, triggering CaMKII and AMPA receptor insertion.',
				'When post fires before pre (LTD): the postsynaptic depolarization has already passed when glutamate arrives. Different Ca2+ dynamics activate phosphatases instead, removing AMPA receptors.',
				'The asymmetry in the STDP window (A- slightly > A+) provides homeostatic stability — without it, runaway potentiation would cause epileptic activity.',
			],
			connectionToAI:
				'Backpropagation in artificial neural networks is a more powerful but biologically implausible learning rule. STDP is local (each synapse only needs info from its pre and post neuron), while backprop requires a global error signal. Bridging this gap is an active research area (e.g., equilibrium propagation, predictive coding).',
		},
	};
}

function parseParams(url: URL): STDPParams {
	const params = { ...DEFAULTS };
	for (const key of Object.keys(DEFAULTS) as (keyof STDPParams)[]) {
		const val = url.searchParams.get(key);
		if (val !== null) {
			const parsed = parseFloat(val);
			if (!isNaN(parsed)) {
				params[key] = parsed;
			}
		}
	}
	params.pairCount = Math.min(params.pairCount, 500);
	return params;
}

export function handlePlasticity(request: Request): Response {
	const url = new URL(request.url);
	const params = parseParams(url);
	const result = simulate(params);
	return new Response(JSON.stringify(result, null, 2), {
		headers: { 'Content-Type': 'application/json' },
	});
}
