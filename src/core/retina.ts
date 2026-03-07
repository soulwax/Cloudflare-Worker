export type StimulusType = "spot" | "annulus" | "edge";

export interface RetinaParams {
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

export interface RetinaParamDefinition {
  key: Exclude<keyof RetinaParams, "stimulusType">;
  label: string;
  unit?: string;
  step: number;
  min: number;
  max: number;
}

export interface MatrixPoint {
  x: number;
  y: number;
  value: number;
}

export interface CurvePoint {
  x: number;
  value: number;
}

export interface RetinaResult {
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

export const defaultRetinaParams: RetinaParams = {
  gridSize: 29,
  centerSigma: 2.6,
  surroundSigma: 5.8,
  surroundStrength: 0.58,
  stimulusType: "spot",
  stimulusRadius: 4.5,
  annulusWidth: 2.5,
  stimulusX: 0,
  stimulusY: 0,
  contrast: 1,
};

export const retinaParamDefinitions: RetinaParamDefinition[] = [
  {
    key: "gridSize",
    label: "Grid Size",
    unit: "cells",
    step: 2,
    min: 15,
    max: 41,
  },
  {
    key: "centerSigma",
    label: "Center Sigma",
    unit: "cells",
    step: 0.1,
    min: 0.8,
    max: 8,
  },
  {
    key: "surroundSigma",
    label: "Surround Sigma",
    unit: "cells",
    step: 0.1,
    min: 1.4,
    max: 12,
  },
  {
    key: "surroundStrength",
    label: "Surround Strength",
    step: 0.01,
    min: 0.1,
    max: 1.5,
  },
  {
    key: "stimulusRadius",
    label: "Stimulus Radius",
    unit: "cells",
    step: 0.1,
    min: 0.5,
    max: 12,
  },
  {
    key: "annulusWidth",
    label: "Annulus Width",
    unit: "cells",
    step: 0.1,
    min: 0.5,
    max: 8,
  },
  {
    key: "stimulusX",
    label: "Stimulus X",
    unit: "cells",
    step: 0.5,
    min: -12,
    max: 12,
  },
  {
    key: "stimulusY",
    label: "Stimulus Y",
    unit: "cells",
    step: 0.5,
    min: -12,
    max: 12,
  },
  {
    key: "contrast",
    label: "Contrast",
    step: 0.1,
    min: -1,
    max: 1,
  },
];

export const retinaStimulusTypes = [
  { value: "spot", label: "Spot" },
  { value: "annulus", label: "Annulus" },
  { value: "edge", label: "Edge" },
] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 4): number {
  return Number(value.toFixed(digits));
}

function gaussian(distanceSquared: number, sigma: number): number {
  return Math.exp(-distanceSquared / (2 * sigma * sigma));
}

export function sanitizeRetinaParams(params: RetinaParams): RetinaParams {
  const next = {
    ...params,
    gridSize: Math.floor(clamp(params.gridSize, 15, 41)),
    centerSigma: clamp(params.centerSigma, 0.8, 8),
    surroundSigma: clamp(params.surroundSigma, 1.4, 12),
    surroundStrength: clamp(params.surroundStrength, 0.1, 1.5),
    stimulusRadius: clamp(params.stimulusRadius, 0.5, 12),
    annulusWidth: clamp(params.annulusWidth, 0.5, 8),
    stimulusX: clamp(params.stimulusX, -12, 12),
    stimulusY: clamp(params.stimulusY, -12, 12),
    contrast: clamp(params.contrast, -1, 1),
  };

  if (next.gridSize % 2 === 0) {
    next.gridSize += 1;
  }

  next.surroundSigma = clamp(next.surroundSigma, next.centerSigma + 0.5, 12);

  return next;
}

function receptiveFieldValue(x: number, y: number, params: RetinaParams): number {
  const distanceSquared = x * x + y * y;
  return (
    gaussian(distanceSquared, params.centerSigma) -
    params.surroundStrength * gaussian(distanceSquared, params.surroundSigma)
  );
}

function stimulusValue(
  x: number,
  y: number,
  params: RetinaParams,
  radius = params.stimulusRadius,
  xOffset = params.stimulusX,
): number {
  const dx = x - xOffset;
  const dy = y - params.stimulusY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  switch (params.stimulusType) {
    case "spot":
      return distance <= radius ? params.contrast : 0;
    case "annulus":
      return distance >= radius && distance <= radius + params.annulusWidth
        ? params.contrast
        : 0;
    case "edge":
      return dx >= 0 ? params.contrast : 0;
  }
}

function computeResponse(
  params: RetinaParams,
  radius = params.stimulusRadius,
  xOffset = params.stimulusX,
): number {
  const half = Math.floor(params.gridSize / 2);
  let total = 0;

  for (let y = -half; y <= half; y += 1) {
    for (let x = -half; x <= half; x += 1) {
      total +=
        receptiveFieldValue(x, y, params) *
        stimulusValue(x, y, params, radius, xOffset);
    }
  }

  return total;
}

export function simulateRetina(input: RetinaParams): RetinaResult {
  const params = sanitizeRetinaParams(input);
  const half = Math.floor(params.gridSize / 2);
  const receptiveField: MatrixPoint[] = [];
  const stimulus: MatrixPoint[] = [];

  for (let y = -half; y <= half; y += 1) {
    for (let x = -half; x <= half; x += 1) {
      receptiveField.push({
        x,
        y,
        value: round(receptiveFieldValue(x, y, params)),
      });
      stimulus.push({
        x,
        y,
        value: round(stimulusValue(x, y, params)),
      });
    }
  }

  const sizeTuning: CurvePoint[] = [];
  for (let radius = 0.5; radius <= 12; radius += 0.5) {
    sizeTuning.push({
      x: round(radius, 2),
      value: round(
        computeResponse({ ...params, stimulusType: "spot" }, radius, 0),
        5,
      ),
    });
  }

  const positionScan: CurvePoint[] = [];
  for (let xOffset = -12; xOffset <= 12; xOffset += 0.5) {
    positionScan.push({
      x: round(xOffset, 2),
      value: round(
        computeResponse(params, params.stimulusRadius, xOffset),
        5,
      ),
    });
  }

  return {
    params,
    receptiveField,
    stimulus,
    response: round(computeResponse(params), 5),
    sizeTuning,
    positionScan,
    explanation: {
      model:
        "A difference-of-Gaussians receptive field approximating ON-center/OFF-surround retinal ganglion-cell behavior.",
      notes: [
        "Small bright spots excite the ON center strongly before the inhibitory surround can dominate.",
        "As the spot expands, the surround contributes more negative drive and the net response can fall back toward zero or below.",
        "Edge and annulus stimuli reveal that the retina emphasizes contrast structure, not raw luminance alone.",
      ],
    },
  };
}
