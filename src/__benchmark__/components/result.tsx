import { type ReactElement } from 'react';

import { type BenchmarkResult } from './benchmark';

interface ResultProps {
  $library: string;
  $benchmark: string;
  $result: BenchmarkResult;
}

function Result({ $library, $benchmark, $result }: ResultProps): ReactElement {
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

export { Result };
