import { Tree } from '../../components/tree';
import { type BenchmarkRender, type BenchmarkType } from '../../types/benchmark-config';

export const name = 'Mount deep tree';
export const type: BenchmarkType = 'mount';
export const render: BenchmarkRender = ({ Box }) => <Tree breadth={2} depth={7} Box={Box} wrap={1} />;
