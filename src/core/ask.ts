export interface AskTopicOption {
	id: string;
	label: string;
	description: string;
}

export interface AskExamplePrompt {
	topic: string;
	topicLabel: string;
	question: string;
}

export const askSystemPrompt = `You are a neuroscience tutor for undergraduate students. Your goal is to build intuition, not just deliver facts.

Rules:
- Use the Socratic method: ask guiding questions before revealing answers
- Always connect concepts to concrete examples (what would a patient experience? what experiment demonstrated this?)
- When explaining a mechanism, start from what the student can observe (behavior) and work inward (circuits, cells, molecules)
- Correct misconceptions directly but kindly
- Use analogies to everyday experience, but flag where the analogy breaks down
- If asked about AI/ML concepts, draw explicit parallels to the biological inspiration
- Keep responses focused and under 300 words unless the student asks for depth
- Cite key experiments or researchers when relevant (Hodgkin & Huxley, Hubel & Wiesel, Kandel, etc.)`;

export const askTopicContext: Record<string, string> = {
	'action-potential': `The student wants to learn about action potentials. Key concepts to cover:
- Resting potential (-70mV) maintained by Na+/K+ ATPase
- Depolarization when voltage-gated Na+ channels open
- The all-or-nothing principle and threshold (~-55mV)
- Repolarization via delayed K+ channel opening
- Refractory periods (absolute vs relative)
- Saltatory conduction along myelinated axons
- Hodgkin-Huxley model (1952) from squid giant axon experiments`,

	synapse: `The student wants to learn about synaptic transmission. Key concepts:
- Chemical vs electrical synapses
- Vesicle release triggered by Ca2+ influx
- Neurotransmitter binding to postsynaptic receptors (ionotropic vs metabotropic)
- Excitatory (glutamate/AMPA/NMDA) vs inhibitory (GABA) transmission
- Synaptic integration: spatial and temporal summation
- Dale's principle and its modern nuances
- Quantal release and the work of Katz & del Castillo`,

	plasticity: `The student wants to learn about synaptic plasticity. Key concepts:
- Hebb's rule: "neurons that fire together wire together" (1949)
- Long-term potentiation (LTP): Bliss & Lomo, 1973
- NMDA receptor as coincidence detector (requires both glutamate AND depolarization)
- Long-term depression (LTD)
- Spike-timing dependent plasticity (STDP): precise timing matters
- Homeostatic plasticity (synaptic scaling)
- Connection to learning and memory (Kandel's work on Aplysia)`,

	'visual-system': `The student wants to learn about the visual system. Key concepts:
- Retinal processing: photoreceptors -> bipolar cells -> ganglion cells
- ON-center/OFF-surround receptive fields
- Retinotopic mapping to V1
- Hubel & Wiesel's Nobel Prize work on orientation selectivity
- Ventral ("what") vs dorsal ("where") streams
- Face recognition in fusiform face area
- Visual illusions as windows into processing mechanisms`,

	'neural-coding': `The student wants to learn about neural coding. Key concepts:
- Rate coding vs temporal coding
- Population coding and ensemble representations
- Sparse coding in sensory cortex
- Place cells (O'Keefe) and grid cells (Moser & Moser) - Nobel Prize 2014
- Predictive coding and the free energy principle (Friston)
- The binding problem: how does the brain unify features?
- Information theory applied to neural signals (Shannon entropy in spike trains)`,

	memory: `The student wants to learn about memory systems. Key concepts:
- Patient H.M. and the discovery of hippocampal memory systems
- Declarative (explicit) vs procedural (implicit) memory
- Hippocampal consolidation and systems consolidation theory
- Working memory and prefrontal cortex
- Engram cells: modern search for the memory trace (Tonegawa lab)
- Reconsolidation: memories become labile when reactivated
- Sleep's role in memory consolidation (sharp-wave ripples, spindles)`,
};

export const askTopicOptions: AskTopicOption[] = [
	{
		id: 'action-potential',
		label: 'Action Potentials',
		description:
			'Thresholds, sodium and potassium conductances, refractory periods, and axonal propagation.',
	},
	{
		id: 'synapse',
		label: 'Synaptic Transmission',
		description:
			'Vesicle release, receptor classes, excitation versus inhibition, and quantal neurotransmission.',
	},
	{
		id: 'plasticity',
		label: 'Synaptic Plasticity',
		description:
			'Hebbian learning, NMDA coincidence detection, LTP/LTD, and timing-dependent learning rules.',
	},
	{
		id: 'visual-system',
		label: 'Visual System',
		description:
			'Retinal preprocessing, receptive fields, ventral versus dorsal streams, and cortical object recognition.',
	},
	{
		id: 'neural-coding',
		label: 'Neural Coding',
		description:
			'Rate codes, temporal structure, population codes, sparse coding, and predictive coding.',
	},
	{
		id: 'memory',
		label: 'Memory Systems',
		description:
			'Hippocampal consolidation, working memory, engrams, reconsolidation, and systems memory.',
	},
];

export const askExamplePrompts: AskExamplePrompt[] = [
	{
		topic: 'action-potential',
		topicLabel: 'Action Potentials',
		question: 'Why is the action potential all-or-nothing?',
	},
	{
		topic: 'plasticity',
		topicLabel: 'Plasticity',
		question: 'How does the NMDA receptor act as a coincidence detector?',
	},
	{
		topic: 'memory',
		topicLabel: 'Memory',
		question: 'What did patient H.M. teach us about memory?',
	},
	{
		topic: 'visual-system',
		topicLabel: 'Visual System',
		question: 'How is a convolutional neural network like the visual cortex?',
	},
];

export const askAvailableTopics = askTopicOptions.map((topic) => topic.id);
