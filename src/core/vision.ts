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

export interface VisionConsultCase {
	id: string;
	title: string;
	syndromeFrame: string;
	strongestLocalization: string;
	whyItFits: string;
	weakerAlternative: string;
	whyAlternativeWeaker: string;
	decisiveNextData: string[];
	pipelineCorrelation: string;
	teachingPearls: string[];
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

export const visionConsultCases: VisionConsultCase[] = [
	{
		id: 'homonymous-hemianopia',
		title: 'Homonymous field cut after a hemispheric event',
		syndromeFrame:
			'A congruous homonymous visual field deficit is a retrochiasmal syndrome until proven otherwise, and the key question is how far posterior the lesion sits.',
		strongestLocalization: 'Contralateral retrochiasmal pathway, especially optic radiations or occipital cortex',
		whyItFits:
			'Both eyes lose the same hemifield, which means binocular visual information has already crossed and reconverged beyond the chiasm. Congruity and cortical sparing patterns then help push the localization further posterior.',
		weakerAlternative: 'Optic nerve or chiasmal lesion',
		whyAlternativeWeaker:
			'Prechiasmal lesions cause monocular loss, and chiasmal lesions usually split nasal retinal fibers to create bitemporal field loss rather than a homonymous pattern.',
		decisiveNextData: [
			'Formal perimetry to define congruity and macular sparing',
			'Occipital versus radiation imaging correlation',
		],
		pipelineCorrelation:
			'This is a failure near or before V1 entry into the cortical pipeline, where retinotopic field information is first made explicit.',
		teachingPearls: [
			'Field defects are anatomy maps before they are disease labels.',
			'The more congruous the defect, the more posterior the retrochiasmal lesion usually is.',
		],
	},
	{
		id: 'prosopagnosia',
		title: 'Face recognition failure with preserved basic vision',
		syndromeFrame:
			'The patient sees normally enough to describe a face, but visual identity for faces fails, pointing toward a high-order ventral-stream problem rather than a low-level visual input failure.',
		strongestLocalization: 'Right ventral occipitotemporal or anterior inferotemporal face-recognition network',
		whyItFits:
			'The deficit is category-selective and appears after early vision is intact. That pushes the lesion away from retina and V1 and toward late ventral-stream representations that bind facial structure to identity.',
		weakerAlternative: 'Primary visual cortex lesion',
		whyAlternativeWeaker:
			'V1 damage should produce acuity loss, field loss, or cortical blindness patterns, not isolated loss of facial identity with preserved object description.',
		decisiveNextData: [
			'Compare face recognition against object, word, and voice recognition',
			'Inspect ventral temporal imaging, especially fusiform and adjacent occipitotemporal cortex',
		],
		pipelineCorrelation:
			'This maps best to the late IT stages of the pipeline, where category and object identity become view-invariant enough to support recognition.',
		teachingPearls: [
			'What is spared can localize as strongly as what is lost.',
			'Prosopagnosia is a ventral-stream identity disorder, not a generic visual failure.',
		],
	},
	{
		id: 'achromatopsia',
		title: 'Color perception collapses while form remains readable',
		syndromeFrame:
			'The patient can track objects and read shapes, yet the visual world loses stable color, which is a classic cortical color-processing dissociation.',
		strongestLocalization: 'V4-dominant ventral visual cortex',
		whyItFits:
			'Color constancy and intermediate-shape coding live strongly in V4. A lesion there can preserve much of basic edge and form extraction while selectively damaging cortical color experience.',
		weakerAlternative: 'Retinal cone disorder',
		whyAlternativeWeaker:
			'Retinal cone pathology usually changes the visual input itself and often brings acuity or generalized sensory changes, whereas cortical achromatopsia can preserve many early visual functions.',
		decisiveNextData: [
			'Test whether color naming and matching fail despite preserved luminance-based form perception',
			'Review ventral occipital imaging rather than stopping at ocular examination',
		],
		pipelineCorrelation:
			'This most directly aligns with the V4 stage of the cortical pipeline, where color constancy and richer contour representation become prominent.',
		teachingPearls: [
			'Color is not finished in the retina; it becomes perceptually stable in cortex.',
			'Preserved shape with lost color is a strong dissociation, not a contradiction.',
		],
	},
	{
		id: 'visual-form-agnosia',
		title: 'Objects can be seen but not assembled into stable form',
		syndromeFrame:
			'Visual input reaches the patient, yet coherent object structure cannot be built reliably enough for recognition or copying, suggesting an intermediate ventral-stream integration failure.',
		strongestLocalization: 'Occipitotemporal visual association cortex between early occipital encoding and late inferotemporal identity stages',
		whyItFits:
			'The lesion seems later than pure field encoding but earlier than fully abstract identity mapping. That is the territory where features are grouped into object-level forms.',
		weakerAlternative: 'Optic neuropathy',
		whyAlternativeWeaker:
			'Optic nerve pathology should distort the incoming signal broadly, often with acuity or contrast loss, rather than selectively preventing assembly of complex form.',
		decisiveNextData: [
			'Compare copying, shape matching, and object naming to separate perceptual assembly from semantics',
			'Review posterior ventral-stream imaging for associative visual cortex involvement',
		],
		pipelineCorrelation:
			'This sits between V2/V4 grouping operations and the IT identity stages, where features must become coherent object form before recognition can succeed.',
		teachingPearls: [
			'Association cortex lesions often break the link between intact sensation and useful perception.',
			'Visual agnosia is best localized by asking which processing step fails, not by asking whether vision is present.',
		],
	},
	{
		id: 'bitemporal-hemianopia',
		title: 'Temporal fields fall away on both sides',
		syndromeFrame:
			'A bitemporal field pattern is a pre-cortical routing problem until proven otherwise, and its value lies in how specifically it points to fiber crossing anatomy.',
		strongestLocalization: 'Optic chiasm',
		whyItFits:
			'Crossing nasal retinal fibers are selectively vulnerable at the chiasm, creating temporal field loss in both eyes before information even reaches V1.',
		weakerAlternative: 'Occipital cortex lesion',
		whyAlternativeWeaker:
			'Occipital lesions produce homonymous defects after binocular streams have already combined. They do not selectively carve out the temporal halves of both monocular fields.',
		decisiveNextData: [
			'Formal visual field testing with careful monocular mapping',
			'Pituitary and parasellar imaging rather than cortical imaging alone',
		],
		pipelineCorrelation:
			'This fails before cortical pipeline entry, which is exactly why the field pattern is so localizing.',
		teachingPearls: [
			'Not every visual syndrome is cortical; some of the most elegant ones are pre-cortical.',
			'Chiasmal syndromes are about wiring geometry before they are about tumor names.',
		],
	},
];
