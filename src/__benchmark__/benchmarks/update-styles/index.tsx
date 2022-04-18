import { SierpinskiTriangle } from '../../components/sierpinski-triangle';
import { type BenchmarkRender, type BenchmarkType } from '../../types/benchmark-config';

const name = 'Dynamic style updates';
const type: BenchmarkType = 'update';
const render: BenchmarkRender = ({ Dot }, renderCount) => (
  <SierpinskiTriangle Dot={Dot} renderCount={renderCount} s={200} x={0} y={0} />
);

export { name, render, type };
