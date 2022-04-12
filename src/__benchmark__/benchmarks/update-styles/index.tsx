import { SierpinskiTriangle } from '../../components/sierpinski-triangle';
import { type BenchmarkRender, type BenchmarkType } from '../../types/benchmark-config';

export const name = 'Dynamic style updates';
export const type: BenchmarkType = 'update';
export const render: BenchmarkRender = ({ Dot }, renderCount) => (
  <SierpinskiTriangle Dot={Dot} renderCount={renderCount} s={200} x={0} y={0} />
);
