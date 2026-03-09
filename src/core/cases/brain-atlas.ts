import type { BrainAtlasLocalizationCase } from "~/core/cases";

export const brainAtlasCases: BrainAtlasLocalizationCase[] = [
  {
    id: "dysexecutive-syndrome",
    title: "Planning failure after frontal injury",
    oneLiner:
      "A patient can speak and move but cannot organize multi-step tasks or suppress impulsive responses.",
    chiefComplaint: "Family reports severe disorganization and poor judgment after a head injury.",
    history:
      "The patient forgets goals halfway through tasks, perseverates on the wrong rule, and becomes impulsive when asked to switch plans.",
    examFindings: [
      "Poor set shifting on executive testing",
      "Marked distractibility with intact primary strength and sensation",
      "Behavioral disinhibition without aphasia or cerebellar ataxia",
    ],
    prompt:
      "Which region is the best localization target for this syndrome, and why does that region fit better than a purely motor or sensory explanation?",
    hints: [
      "Look for the region that keeps goals online and suppresses distractions.",
      "The patient has a control problem, not a weakness problem.",
    ],
    teachingPoints: [
      "Executive dysfunction points more strongly to prefrontal systems than to primary motor or sensory cortex.",
      "Dysexecutive syndromes often reflect disrupted top-down control over action selection, memory, and attention.",
    ],
    followUpModules: ["neuron", "dopamine", "ask"],
    expectedRegionId: "prefrontal",
    startingRegionId: "motor",
  },
  {
    id: "anterograde-amnesia",
    title: "Cannot form new episodic memories",
    oneLiner:
      "A patient repeats the same questions and cannot retain new events after a hypoxic injury.",
    chiefComplaint: "The patient asks where they are every few minutes despite repeated explanations.",
    history:
      "Remote memories are relatively intact, language is fluent, and attention is adequate during conversation, but new experiences are not being stored.",
    examFindings: [
      "Severe anterograde memory deficit",
      "Preserved basic language and motor function",
      "Spatial disorientation in unfamiliar settings",
    ],
    prompt:
      "Which structure best explains this pattern, and why is it stronger than a pure frontal or thalamic explanation?",
    hints: [
      "The key deficit is binding new events into context-rich memory.",
      "Think medial temporal memory circuitry.",
    ],
    teachingPoints: [
      "Anterograde amnesia is classically associated with hippocampal injury.",
      "The hippocampus links what happened, where it happened, and when it happened into episodic traces.",
    ],
    followUpModules: ["grid-cell", "ask", "brain-atlas"],
    expectedRegionId: "hippocampus",
    startingRegionId: "thalamus",
  },
  {
    id: "parkinsonian-bradykinesia",
    title: "Slow movement with reduced spontaneity",
    oneLiner:
      "A patient has reduced movement vigor, difficulty initiating gait, and a mask-like facial expression.",
    chiefComplaint: "Movement feels effortful and slow despite preserved comprehension.",
    history:
      "The patient can generate movement when strongly cued, but self-initiated movement is reduced and gait initiation is hesitant.",
    examFindings: [
      "Bradykinesia with reduced spontaneous gesture",
      "Difficulty initiating voluntary movement",
      "No primary sensory loss or aphasia",
    ],
    prompt:
      "Which region best fits the action-selection failure here, and what loop makes it especially relevant?",
    hints: [
      "This is about gating and movement vigor more than muscle execution itself.",
      "Think cortex-thalamus-subcortex loops.",
    ],
    teachingPoints: [
      "Basal ganglia dysfunction often impairs initiation and scaling of movement rather than raw corticospinal output.",
      "Movement disorders are usually loop disorders, not isolated one-way pathway failures.",
    ],
    followUpModules: ["dopamine", "plasticity", "ask"],
    expectedRegionId: "basalGanglia",
    startingRegionId: "motor",
  },
  {
    id: "cerebellar-ataxia",
    title: "Overshoot and poor correction",
    oneLiner:
      "A patient reaches past the target and cannot smoothly correct the movement trajectory.",
    chiefComplaint: "The hand wobbles and overshoots during goal-directed movement.",
    history:
      "There is no major weakness, but timing and coordination collapse during fast or precise actions.",
    examFindings: [
      "Dysmetria on finger-nose testing",
      "Poor rapid alternating movements",
      "Broad-based unsteady gait",
    ],
    prompt:
      "Which region best localizes this error-correction problem, and what makes it different from motor cortex weakness?",
    hints: [
      "The patient can generate force but cannot calibrate timing.",
      "Think prediction and correction, not command generation.",
    ],
    teachingPoints: [
      "Cerebellar lesions often impair timing, coordination, and error correction rather than movement initiation.",
      "Ataxia is often a prediction problem: intended movement and actual movement stop matching.",
    ],
    followUpModules: ["neuron", "plasticity", "ask"],
    expectedRegionId: "cerebellum",
    startingRegionId: "motor",
  },
];
