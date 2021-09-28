import React, { ReactElement } from 'react';
import { IBenchmarkResult } from './Benchmark';

export interface IResultProps {
  $library: string;
  $benchmark: string;
  $result: IBenchmarkResult;
}

export function Result({ $library, $benchmark, $result }: IResultProps): ReactElement {
  return (
    <div className={'result'}>
      <div className={'result__start'}>
        <div className={'result__cell result__library'}>{$library}</div>
        <div className={'result__cell result__benchmark'}>
          {$benchmark} ({$result.sampleCount})
        </div>
      </div>
      <div className={'result__end'}>
        <div className={'result__cell result__time-primary'}>
          {$result.total.mean.toFixed(2)} ±{$result.total.stdDev.toFixed(2)} ms
        </div>
        <div className={'result__cell result__time-secondary'}>
          (S/L) {$result.scripting.mean.toFixed(2)}/{$result.layout.mean.toFixed(2)} ms
        </div>
      </div>
    </div>
  );
}
