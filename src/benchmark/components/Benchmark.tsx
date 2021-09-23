import { ReactElement, useLayoutEffect, useRef, useState } from 'react';

interface ISample {
  scriptStart: number;
  layoutStart: number;
  end: number;
}

function getMean(values: number[]): number {
  const sum = values.reduce((acc: number, value: number) => acc + value, 0);
  return sum / values.length;
}

function getStdDev(values: number[]): number {
  const avg = getMean(values);

  const squareDiffs = values.map((value: number) => {
    const diff = value - avg;
    return diff * diff;
  });

  return Math.sqrt(getMean(squareDiffs));
}

export interface IBenchmarkValue {
  mean: number;
  stdDev: number;
}

export interface IBenchmarkResult {
  sampleCount: number;
  total: IBenchmarkValue;
  scripting: IBenchmarkValue;
  layout: IBenchmarkValue;
}

export interface IBenchmarkConfig {
  name: string;
  type: 'mount' | 'unmount' | 'update';
  timeout?: number | undefined;
  sampleCount?: number | undefined;
  render: (i: number) => ReactElement;
}

export interface IBenchmarkProps {
  config?: IBenchmarkConfig | null;
  onResult?: (results: IBenchmarkResult) => void;
}

export function Benchmark({ config: _config = null, onResult }: IBenchmarkProps): ReactElement | null {
  const [config, setConfig] = useState<IBenchmarkConfig | null>(null);
  const [cycle, setCycle] = useState(NaN);
  const startTime = useRef(0);
  const samples = useRef<ISample[]>([]);
  const raf = useRef<number>();

  const type = config?.type ?? 'update';
  const sampleCount = config?.sampleCount ?? 1000;
  const timeout = config?.timeout ?? 30000;
  const mount = isNaN(cycle) ? false : type === 'mount' || type === 'unmount' ? !((cycle + 1) % 2) : true;
  const record = isNaN(cycle)
    ? false
    : type === 'mount'
    ? !((cycle + 1) % 2)
    : type === 'unmount'
    ? !(cycle % 2)
    : cycle > 1;

  // Update the config.
  useLayoutEffect(() => {
    setConfig(_config);
  }, [_config]);

  // Start the benchmark run.
  useLayoutEffect(() => {
    if (config == null) {
      return;
    }

    raf.current = requestAnimationFrame(() => {
      startTime.current = performance.now();
      raf.current = undefined;
      setCycle(0);
    });

    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = undefined;
      }

      const totals = samples.current.reduce<number[]>((acc, sample) => [...acc, sample.end - sample.scriptStart], []);
      const scriptTotals = samples.current.reduce<number[]>(
        (acc, sample) => [...acc, sample.layoutStart - sample.scriptStart],
        [],
      );
      const layoutTotals = samples.current.reduce<number[]>(
        (acc, sample) => [...acc, sample.end - sample.layoutStart],
        [],
      );

      onResult?.({
        sampleCount: samples.current.length,
        total: {
          mean: getMean(totals),
          stdDev: getStdDev(totals),
        },
        scripting: {
          mean: getMean(scriptTotals),
          stdDev: getStdDev(scriptTotals),
        },
        layout: {
          mean: getMean(layoutTotals),
          stdDev: getStdDev(layoutTotals),
        },
      });

      samples.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  // Handle each cycle.
  useLayoutEffect(() => {
    if (config == null) {
      return;
    }

    if (record) {
      const sample = samples.current[cycle];

      sample.layoutStart = performance.now();
      document.body.offsetWidth; // Force update.
      sample.end = performance.now();
    } else {
      document.body.offsetWidth; // Force update.
    }

    if (startTime.current + timeout <= performance.now() || samples.current.length >= sampleCount) {
      setConfig(null);
      setCycle(NaN);
      return;
    }

    raf.current = requestAnimationFrame(() => {
      raf.current = undefined;
      setCycle(cycle + 1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle, record]);

  // Handle unmount.
  useLayoutEffect(
    () => () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    },
    [],
  );

  if (config == null) {
    return null;
  }

  if (record) {
    samples.current[cycle] = {
      scriptStart: performance.now(),
      layoutStart: 0,
      end: 0,
    };
  }

  return mount ? config.render(samples.current.length) : null;
}
