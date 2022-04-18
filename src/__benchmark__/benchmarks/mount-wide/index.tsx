import { Tree } from '../../components/tree';
import { type BenchmarkRender, type BenchmarkType } from '../../types/benchmark-config';

const name = 'Mount wide tree';
const type: BenchmarkType = 'mount';
const render: BenchmarkRender = ({ Box }) => <Tree breadth={6} depth={3} Box={Box} wrap={2} />;

export { name, render, type };
