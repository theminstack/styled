import React from 'react';
import SierpinskiTriangle from '../../components/SierpinskiTriangle';
import { BenchmarkRender, BenchmarkType } from '../../types/schemaBenchmarkConfig';

export const name = 'Dynamic style updates';
export const type: BenchmarkType = 'update';
export const render: BenchmarkRender = ({ Dot }, renderCount) => (
  <SierpinskiTriangle Dot={Dot} renderCount={renderCount} s={200} x={0} y={0} />
);
