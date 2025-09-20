import type { AnimationComponentMap } from '@/types/animation';

import { BasicChartsBarChartRise } from './BasicChartsBarChartRise';
import { BasicChartsBarChartStack } from './BasicChartsBarChartStack';
import { BasicChartsDeltaGlow } from './BasicChartsDeltaGlow';
import { BasicChartsGaugeSweep } from './BasicChartsGaugeSweep';
import { BasicChartsLineChartDash } from './BasicChartsLineChartDash';
import { BasicChartsLineChartDraw } from './BasicChartsLineChartDraw';
import { BasicChartsPieChartRotate } from './BasicChartsPieChartRotate';
import { BasicChartsPieChartSlice } from './BasicChartsPieChartSlice';
import { BasicChartsRankSlide } from './BasicChartsRankSlide';
import { BasicChartsStatCount } from './BasicChartsStatCount';
import { BasicChartsStatFlip } from './BasicChartsStatFlip';
import { BasicChartsTrendHighlight } from './BasicChartsTrendHighlight';

export { BasicChartsBarChartRise } from './BasicChartsBarChartRise';
export { BasicChartsBarChartStack } from './BasicChartsBarChartStack';
export { BasicChartsDeltaGlow } from './BasicChartsDeltaGlow';
export { BasicChartsGaugeSweep } from './BasicChartsGaugeSweep';
export { BasicChartsLineChartDash } from './BasicChartsLineChartDash';
export { BasicChartsLineChartDraw } from './BasicChartsLineChartDraw';
export { BasicChartsPieChartRotate } from './BasicChartsPieChartRotate';
export { BasicChartsPieChartSlice } from './BasicChartsPieChartSlice';
export { BasicChartsRankSlide } from './BasicChartsRankSlide';
export { BasicChartsStatCount } from './BasicChartsStatCount';
export { BasicChartsStatFlip } from './BasicChartsStatFlip';
export { BasicChartsTrendHighlight } from './BasicChartsTrendHighlight';

export const dataBasicChartsAnimations: AnimationComponentMap = {
  'basic-charts__bar-chart-rise': BasicChartsBarChartRise,
  'basic-charts__bar-chart-stack': BasicChartsBarChartStack,
  'basic-charts__delta-glow': BasicChartsDeltaGlow,
  'basic-charts__gauge-sweep': BasicChartsGaugeSweep,
  'basic-charts__line-chart-dash': BasicChartsLineChartDash,
  'basic-charts__line-chart-draw': BasicChartsLineChartDraw,
  'basic-charts__pie-chart-rotate': BasicChartsPieChartRotate,
  'basic-charts__pie-chart-slice': BasicChartsPieChartSlice,
  'basic-charts__rank-slide': BasicChartsRankSlide,
  'basic-charts__stat-count': BasicChartsStatCount,
  'basic-charts__stat-flip': BasicChartsStatFlip,
  'basic-charts__trend-highlight': BasicChartsTrendHighlight
};
