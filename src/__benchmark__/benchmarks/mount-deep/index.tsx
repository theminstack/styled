import { Tree } from '../../components/tree';
import { type BenchmarkRender, type BenchmarkType } from '../../types/benchmark-config';

const name = 'Mount deep tree';
const type: BenchmarkType = 'mount';
const render: BenchmarkRender = ({ Box }) => <Tree breadth={2} depth={7} Box={Box} wrap={1} />;

export { name, render, type };
