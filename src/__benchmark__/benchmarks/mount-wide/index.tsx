import { Tree } from '../../components/tree';
import { type BenchmarkRender, type BenchmarkType } from '../../types/benchmark-config';

export const name = 'Mount wide tree';
export const type: BenchmarkType = 'mount';
export const render: BenchmarkRender = ({ Box }) => <Tree breadth={6} depth={3} Box={Box} wrap={2} />;
