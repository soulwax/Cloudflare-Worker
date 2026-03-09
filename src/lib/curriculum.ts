export interface CurriculumModule {
  slug: string;
  title: string;
  learningGoals: string[];
  prerequisites: string[];
  linkedModules: string[];
  commonMisconceptions: string[];
}

export const curriculumModules: CurriculumModule[] = [
  {
    slug: "brain-atlas",
    title: "Brain Atlas",
    learningGoals: [
      "Localize neurological syndromes to major brain systems",
      "Understand why loops matter more than isolated structures",
    ],
    prerequisites: ["Basic neuroanatomy"],
    linkedModules: ["vision", "dopamine", "ask"],
    commonMisconceptions: [
      "One symptom always equals one structure",
      "The thalamus is only a passive relay",
    ],
  },
  {
    slug: "neuron",
    title: "Neuron Simulation",
    learningGoals: [
      "Understand membrane time constants and threshold behavior",
      "Connect ion-channel behavior to excitability",
    ],
    prerequisites: ["Basic action potential physiology"],
    linkedModules: ["plasticity", "ecg"],
    commonMisconceptions: [
      "Bigger input always means immediate spiking",
      "Threshold is fixed and context-free",
    ],
  },
  {
    slug: "retina",
    title: "Retinal Receptive Field Lab",
    learningGoals: [
      "Explain center-surround antagonism",
      "Predict how stimulus size and position change retinal output",
    ],
    prerequisites: ["Basic visual pathway knowledge"],
    linkedModules: ["vision", "brain-atlas"],
    commonMisconceptions: [
      "Ganglion cells respond to brightness alone",
      "Large stimuli always create stronger responses",
    ],
  },
  {
    slug: "plasticity",
    title: "Synaptic Plasticity",
    learningGoals: [
      "Interpret timing-dependent changes in synaptic strength",
      "Relate timing rules to learning and maladaptation",
    ],
    prerequisites: ["Action potentials", "Synaptic transmission"],
    linkedModules: ["neuron", "dopamine"],
    commonMisconceptions: [
      "Any repeated firing strengthens a synapse",
      "Plasticity is always beneficial",
    ],
  },
  {
    slug: "dopamine",
    title: "Dopamine Prediction Error Lab",
    learningGoals: [
      "Understand reward prediction error",
      "Connect dopamine signals to action selection and habit learning",
    ],
    prerequisites: ["Basic reinforcement learning concepts"],
    linkedModules: ["plasticity", "brain-atlas"],
    commonMisconceptions: [
      "Dopamine only means pleasure",
      "Prediction error and reward size are identical",
    ],
  },
  {
    slug: "vision",
    title: "Visual Cortex",
    learningGoals: [
      "Understand hierarchical visual processing",
      "Map perception to ventral stream stages",
    ],
    prerequisites: ["Retinal organization"],
    linkedModules: ["retina", "brain-atlas", "ask"],
    commonMisconceptions: [
      "Vision is computed in one cortical area",
      "Classification and localization are the same process",
    ],
  },
  {
    slug: "ask",
    title: "Neuro Tutor",
    learningGoals: [
      "Practice verbal reasoning and explanation",
      "Strengthen mechanism-based clinical thinking",
    ],
    prerequisites: [],
    linkedModules: ["brain-atlas", "vision", "dopamine"],
    commonMisconceptions: [
      "Fluent explanation equals correct localization",
      "A single buzzword proves understanding",
    ],
  },
  {
    slug: "ecg",
    title: "12-Lead ECG Explorer",
    learningGoals: [
      "Relate autonomic tone to surface rhythm changes",
      "Interpret ECGs through a brain-heart physiology lens",
    ],
    prerequisites: ["Basic cardiac conduction"],
    linkedModules: ["neuron", "ask"],
    commonMisconceptions: [
      "All rhythm changes are primary cardiac pathology",
      "Autonomic effects are invisible on the ECG",
    ],
  },
  {
    slug: "grid-cell",
    title: "Grid Cell Navigator",
    learningGoals: [
      "Understand spatial firing fields",
      "Relate navigation coding to entorhinal function",
    ],
    prerequisites: ["Basic spatial navigation concepts"],
    linkedModules: ["brain-atlas", "ask"],
    commonMisconceptions: [
      "Navigation is only hippocampal",
      "Grid patterns require explicit landmarks at all times",
    ],
  },
];

export function getCurriculumModule(slug: string) {
  return curriculumModules.find((module) => module.slug === slug);
}
