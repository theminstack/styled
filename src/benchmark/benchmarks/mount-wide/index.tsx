import React from 'react';
import Tree from '../../components/Tree';
import { BenchmarkRender, BenchmarkType } from '../../types/schemaBenchmarkConfig';

export const name = 'Mount wide tree';
export const type: BenchmarkType = 'mount';
export const render: BenchmarkRender = ({ Box }) => <Tree breadth={6} depth={3} Box={Box} wrap={2} />;
