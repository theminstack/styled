import React from 'react';
import Tree from '../../components/Tree';
import { BenchmarkRender, BenchmarkType } from '../../types/schemaBenchmarkConfig';

export const name = 'Mount deep tree';
export const type: BenchmarkType = 'mount';
export const render: BenchmarkRender = ({ Box }) => <Tree breadth={2} depth={7} Box={Box} wrap={1} />;
