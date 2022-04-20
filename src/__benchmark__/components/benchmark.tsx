import { type ReactElement, useLayoutEffect, useRef, useState } from 'react';

type Sample = {
  readonly end: number;
  readonly layoutStart: number;
  readonly scriptStart: number;
};

const getMean = (values: readonly number[]): number => {
  const sum = values.reduce((result: number, value: number) => result + value, 0);
  return sum / values.length;
};

const getStandardDeviation = (values: readonly number[]): number => {
  const avg = getMean(values);

  const squareDiffs = values.map((value: number) => {
    const diff = value - avg;
    return diff * diff;
  });

  return Math.sqrt(getMean(squareDiffs));
};

type BenchmarkValue = {
  readonly mean: number;
  readonly stdDev: number;
};

type BenchmarkResult = {
  readonly layout: BenchmarkValue;
  readonly sampleCount: number;
  readonly scripting: BenchmarkValue;
  readonly total: BenchmarkValue;
};

type BenchmarkConfig = {
  readonly name: string;
  readonly render: (index: number) => ReactElement;
  readonly sampleCount?: number | undefined;
  readonly timeout?: number | undefined;
  readonly type: 'mount' | 'unmount' | 'update';
};

type BenchmarkProps = {
  readonly config?: BenchmarkConfig | null;
  readonly onResult?: (results: BenchmarkResult) => void;
};

const Benchmark = ({ config: _config = null, onResult }: BenchmarkProps): ReactElement | null => {
  const [config, setConfig] = useState<BenchmarkConfig | null>(null);
  const [cycle, setCycle] = useState(Number.NaN);
  const startTime = useRef(0);
  const samples = useRef<Sample[]>([]);
  const raf = useRef<number>();

  const type = config?.type ?? 'update';
  const sampleCount = config?.sampleCount ?? 1000;
  const timeout = config?.timeout ?? 30_000;
  const mount = Number.isNaN(cycle) ? false : type === 'mount' || type === 'unmount' ? !((cycle + 1) % 2) : true;
  const record = Number.isNaN(cycle)
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

      const totals = samples.current.reduce<number[]>(
        (result, sample) => [...result, sample.end - sample.scriptStart],
        [],
      );
      const scriptTotals = samples.current.reduce<number[]>(
        (result, sample) => [...result, sample.layoutStart - sample.scriptStart],
        [],
      );
      const layoutTotals = samples.current.reduce<number[]>(
        (result, sample) => [...result, sample.end - sample.layoutStart],
        [],
      );

      onResult?.({
        layout: {
          mean: getMean(layoutTotals),
          stdDev: getStandardDeviation(layoutTotals),
        },
        sampleCount: samples.current.length,
        scripting: {
          mean: getMean(scriptTotals),
          stdDev: getStandardDeviation(scriptTotals),
        },
        total: {
          mean: getMean(totals),
          stdDev: getStandardDeviation(totals),
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
      const layoutStart = performance.now();
      document.body.offsetWidth; // Force update.
      const end = performance.now();
      samples.current[cycle] = { ...samples.current[cycle], end, layoutStart };
    } else {
      document.body.offsetWidth; // Force update.
    }

    if (startTime.current + timeout <= performance.now() || samples.current.length >= sampleCount) {
      setConfig(null);
      setCycle(Number.NaN);
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
      end: 0,
      layoutStart: 0,
      scriptStart: performance.now(),
    };
  }

  return mount ? config.render(samples.current.length) : null;
};

export { type BenchmarkConfig, type BenchmarkProps, type BenchmarkResult, type BenchmarkValue, Benchmark };
