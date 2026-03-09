export const ecgLeadNames = [
  "I",
  "II",
  "III",
  "aVR",
  "aVL",
  "aVF",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
] as const;

export type ECGLeadName = (typeof ecgLeadNames)[number];

export type ECGPhase =
  | "Baseline"
  | "P wave"
  | "QRS"
  | "ST segment"
  | "T wave";

export interface ECGParams {
  heartRate: number;
  duration: number;
  dt: number;
  axisDegrees: number;
  pAmp: number;
  qrsAmp: number;
  tAmp: number;
  prInterval: number;
  qrsDuration: number;
  qtInterval: number;
  stShift: number;
  rhythmIrregularity: number;
  noise: number;
  baselineWander: number;
  precordialRotation: number;
  gain: number;
}

export interface ECGParamDefinition {
  key: keyof ECGParams;
  label: string;
  unit?: string;
  step: number;
  min: number;
  max: number;
}

export interface ECGControlGroup {
  id: string;
  label: string;
  description: string;
  keys: ReadonlyArray<keyof ECGParams>;
}

export interface ECGPreset {
  id: string;
  label: string;
  description: string;
  neuroFocus: string;
  params: ECGParams;
}

export interface ECGPoint {
  t: number;
  mv: number;
}

export interface ECGLeadAxis {
  name: ECGLeadName;
  group: "limb" | "precordial";
  x: number;
  y: number;
  z: number;
}

export interface ECGActivationFrame {
  t: number;
  phase: ECGPhase;
  vector: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
  };
  regions: {
    atria: number;
    septum: number;
    rightVentricle: number;
    leftVentricle: number;
    repolarization: number;
  };
  dominantLead: ECGLeadName;
  dominantProjection: number;
}

export interface ECGBeatLandmarks {
  pOnset: number;
  pPeak: number;
  pOffset: number;
  qrsOnset: number;
  rPeak: number;
  qrsOffset: number;
  tOnset: number;
  tPeak: number;
  tOffset: number;
}

export interface ECGBeatProfile {
  rhythmStripLead: ECGLeadName;
  intervals: {
    rrMs: number;
    prMs: number;
    qrsMs: number;
    qtMs: number;
  };
  landmarks: ECGBeatLandmarks;
}

export interface ECGNeurocardiacSummary {
  autonomicState: string;
  vagalTone: number;
  sympatheticDrive: number;
  respiratoryCoupling: number;
  avNodalBrake: number;
  narrative: string;
  notes: string[];
}

export interface ECGResult {
  params: ECGParams;
  leads: Record<ECGLeadName, ECGPoint[]>;
  activation: {
    beatMs: number;
    frames: ECGActivationFrame[];
    leadAxes: ECGLeadAxis[];
  };
  beat: ECGBeatProfile;
  summary: {
    beatsEstimated: number;
    rrMsNominal: number;
    qtcBazettMs: number;
    electricalAxis: string;
    dominantRhythm: string;
  };
  neurocardiac: ECGNeurocardiacSummary;
  explanation: {
    model: string;
    notes: string[];
  };
}

export const defaultEcgParams: ECGParams = {
  heartRate: 72,
  duration: 6000,
  dt: 4,
  axisDegrees: 45,
  pAmp: 0.14,
  qrsAmp: 1.1,
  tAmp: 0.34,
  prInterval: 160,
  qrsDuration: 95,
  qtInterval: 380,
  stShift: 0,
  rhythmIrregularity: 0.04,
  noise: 0.015,
  baselineWander: 0.045,
  precordialRotation: 0,
  gain: 1,
};

function preset(overrides: Partial<ECGParams>): ECGParams {
  return {
    ...defaultEcgParams,
    ...overrides,
  };
}

export const ecgPresets: ECGPreset[] = [
  {
    id: "balanced-rest",
    label: "Balanced Rest",
    description:
      "A calm sinus-like baseline with modest respiratory variability and standard conduction timings.",
    neuroFocus:
      "Use this to orient learners before comparing vagal and sympathetic autonomic shifts.",
    params: preset({}),
  },
  {
    id: "high-vagal-tone",
    label: "High Vagal Tone",
    description:
      "Slower sinus discharge, longer AV nodal delay, and clearer beat-to-beat respiratory modulation.",
    neuroFocus:
      "Highlights medullary vagal braking of the SA and AV nodes, as seen in athletic or relaxed states.",
    params: preset({
      heartRate: 52,
      prInterval: 190,
      qtInterval: 410,
      qrsAmp: 0.98,
      rhythmIrregularity: 0.1,
      baselineWander: 0.07,
      noise: 0.01,
      axisDegrees: 38,
    }),
  },
  {
    id: "sympathetic-surge",
    label: "Sympathetic Surge",
    description:
      "Faster rate, reduced variability, brisk AV conduction, and shorter repolarization timing.",
    neuroFocus:
      "Useful for teaching catecholaminergic drive from stress, pain, or exercise preparation.",
    params: preset({
      heartRate: 116,
      prInterval: 130,
      qtInterval: 330,
      tAmp: 0.28,
      qrsAmp: 1.28,
      rhythmIrregularity: 0.015,
      baselineWander: 0.03,
      noise: 0.024,
      axisDegrees: 58,
    }),
  },
  {
    id: "orthostatic-compensation",
    label: "Orthostatic Compensation",
    description:
      "Intermediate tachycardia with reduced sinus variability as the autonomic system defends pressure during posture change.",
    neuroFocus:
      "Frames ECG changes in the context of baroreflex unloading and sympathetic recruitment.",
    params: preset({
      heartRate: 96,
      prInterval: 145,
      qtInterval: 350,
      qrsAmp: 1.18,
      rhythmIrregularity: 0.025,
      baselineWander: 0.038,
      noise: 0.02,
      axisDegrees: 54,
    }),
  },
];

export function getEcgPreset(presetId: string) {
  return ecgPresets.find((presetOption) => presetOption.id === presetId);
}

export const ecgParamDefinitions: ECGParamDefinition[] = [
  {
    key: "heartRate",
    label: "Heart Rate",
    unit: "bpm",
    step: 1,
    min: 30,
    max: 220,
  },
  {
    key: "axisDegrees",
    label: "Electrical Axis",
    unit: "deg",
    step: 1,
    min: -180,
    max: 180,
  },
  {
    key: "prInterval",
    label: "PR Interval",
    unit: "ms",
    step: 5,
    min: 80,
    max: 320,
  },
  {
    key: "qrsDuration",
    label: "QRS Duration",
    unit: "ms",
    step: 1,
    min: 50,
    max: 220,
  },
  {
    key: "qtInterval",
    label: "QT Interval",
    unit: "ms",
    step: 5,
    min: 220,
    max: 700,
  },
  {
    key: "pAmp",
    label: "P Amplitude",
    unit: "mV",
    step: 0.01,
    min: 0,
    max: 0.5,
  },
  {
    key: "qrsAmp",
    label: "QRS Amplitude",
    unit: "mV",
    step: 0.05,
    min: 0.2,
    max: 3,
  },
  {
    key: "tAmp",
    label: "T Amplitude",
    unit: "mV",
    step: 0.01,
    min: 0,
    max: 1.2,
  },
  {
    key: "stShift",
    label: "ST Shift",
    unit: "mV",
    step: 0.01,
    min: -0.5,
    max: 0.5,
  },
  {
    key: "rhythmIrregularity",
    label: "Respiratory Variability",
    step: 0.01,
    min: 0,
    max: 0.25,
  },
  {
    key: "precordialRotation",
    label: "Precordial Rotation",
    unit: "deg",
    step: 1,
    min: -45,
    max: 45,
  },
  {
    key: "baselineWander",
    label: "Respiratory Wander",
    unit: "mV",
    step: 0.005,
    min: 0,
    max: 0.25,
  },
  {
    key: "noise",
    label: "Muscle / Motion Noise",
    unit: "mV",
    step: 0.005,
    min: 0,
    max: 0.15,
  },
  {
    key: "gain",
    label: "Display Gain",
    unit: "x",
    step: 0.05,
    min: 0.25,
    max: 3,
  },
  {
    key: "duration",
    label: "Duration",
    unit: "ms",
    step: 250,
    min: 1500,
    max: 12000,
  },
  {
    key: "dt",
    label: "Sample Step",
    unit: "ms",
    step: 1,
    min: 1,
    max: 10,
  },
];

export const ecgControlGroups: ECGControlGroup[] = [
  {
    id: "autonomic",
    label: "Autonomic tone",
    description:
      "Controls that mostly shape sinus rate, respiratory coupling, and baroreflex-style variability.",
    keys: ["heartRate", "rhythmIrregularity", "baselineWander", "noise"],
  },
  {
    id: "conduction",
    label: "Conduction timing",
    description:
      "Intervals that change AV nodal delay, depolarization width, and repolarization timing.",
    keys: ["prInterval", "qrsDuration", "qtInterval", "axisDegrees"],
  },
  {
    id: "morphology",
    label: "Morphology and acquisition",
    description:
      "Amplitude and projection controls that shape what the surface leads record and how strongly they appear.",
    keys: [
      "pAmp",
      "qrsAmp",
      "tAmp",
      "stShift",
      "precordialRotation",
      "gain",
      "duration",
      "dt",
    ],
  },
];
