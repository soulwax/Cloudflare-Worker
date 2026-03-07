export interface VisionStage {
	resnetStage: string;
	corticalArea: string;
	features: string;
	biology: string;
}

export interface VisionSkipConnections {
	what: string;
	neuroscience: string;
}

export interface VisionClassification {
	label: string;
	score: number;
}

export const visionDefaultImageUrl =
	'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg';

export const visionStages: VisionStage[] = [
	{
		resnetStage: 'Conv1 + MaxPool (7x7 conv, stride 2)',
		corticalArea: 'V1 (Primary Visual Cortex)',
		features: 'Oriented edges, contrast boundaries, simple gratings',
		biology:
			'V1 neurons are famously tuned to oriented bars (Hubel & Wiesel, 1962 Nobel Prize). Simple cells detect edges at specific orientations; complex cells are position-invariant.',
	},
	{
		resnetStage: 'Block 1 (3 bottleneck layers)',
		corticalArea: 'V2 (Secondary Visual Cortex)',
		features: 'Corners, junctions, texture boundaries, illusory contours',
		biology:
			'V2 neurons respond to border ownership and can detect contours even when parts are occluded. They begin grouping V1 outputs into more meaningful patterns.',
	},
	{
		resnetStage: 'Block 2 (4 bottleneck layers)',
		corticalArea: 'V4 (Visual Area 4)',
		features: 'Curvature, color constancy, moderate shape complexity',
		biology:
			'V4 is critical for color perception and shape processing. Damage to V4 causes achromatopsia (loss of color vision). Neurons here respond to partial shapes and contour fragments.',
	},
	{
		resnetStage: 'Block 3 (6 bottleneck layers)',
		corticalArea: 'IT (Inferotemporal Cortex) - posterior',
		features: 'Object parts, textures, category-level features',
		biology:
			'Posterior IT neurons respond to complex object features - face parts, body parts, object components. This is where the "grandmother cells" versus distributed coding debate lives.',
	},
	{
		resnetStage: 'Block 4 (3 bottleneck layers)',
		corticalArea: 'IT (Inferotemporal Cortex) - anterior',
		features: 'Whole objects, view-invariant representations',
		biology:
			'Anterior IT neurons are selective for specific objects regardless of position, size, or viewpoint. The fusiform face area is located here.',
	},
	{
		resnetStage: 'Global Average Pool + Fully Connected',
		corticalArea: 'Prefrontal Cortex (decision/categorization)',
		features: 'Category labels, semantic decisions',
		biology:
			'Prefrontal cortex integrates IT representations for task-relevant decisions. "Is this a dog or a cat?" requires PFC to map IT object representations to learned categories.',
	},
];

export const visionSkipConnections: VisionSkipConnections = {
	what: "ResNet's key innovation: skip (residual) connections that bypass layers, letting gradients flow directly backward.",
	neuroscience:
		'The brain has extensive feedback and skip connections too. V1 receives feedback from V2, V4, and even IT cortex. These top-down connections carry predictions and attention signals, not just bottom-up features. This is central to predictive coding theory: the brain constantly predicts its own inputs and only propagates prediction errors upward.',
};

export const visionKeyInsight =
	'ResNet-50 has 50 layers organized in 4 blocks of increasing abstraction - almost exactly mirroring the ventral visual stream from V1 to IT cortex. This is not a coincidence: both systems solve the same problem (object recognition) under similar constraints (hierarchical composition of features).';
