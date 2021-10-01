import { Trash } from 'iconoir-react';
import React, { ReactElement, useCallback, useState } from 'react';
import { benchmarks } from '../benchmarks';
import { libraries } from '../libraries';
import { Actions } from './Actions';
import { Benchmark, IBenchmarkConfig, IBenchmarkResult } from './Benchmark';
import { Button } from './Button';
import { Form } from './Form';
import { Input } from './Input';
import { List } from './List';
import { Output } from './Output';
import { Page } from './Page';
import { Result } from './Result';
import { Select, ISelectItem } from './Select';
import { Separator } from './Separator';

const benchmarkItems = Object.keys(benchmarks)
  .reduce<ISelectItem[]>((acc, key) => [...acc, { value: benchmarks[key].name }], [])
  .sort((a, b) => (a.label ?? a.value).localeCompare(b.label ?? b.value));
const libraryItems = libraries.map((library) => ({ value: library.name }));

export function App(): ReactElement {
  const [library, setLibrary] = useState(libraryItems[0]?.value ?? '');
  const [benchmark, setBenchmark] = useState(benchmarkItems[0]?.value ?? '');
  const [config, setConfig] = useState<{ library: string; benchmark: string; value: IBenchmarkConfig } | null>(null);
  const [results, setResults] = useState<{ library: string; benchmark: string; value: IBenchmarkResult }[]>([]);

  const onRun = useCallback(() => {
    setConfig((current) => {
      if (current != null) {
        return current;
      }

      const benchmarkConfig = benchmarks[benchmark];
      const libraryConfig = libraries.find((item) => item.name === library);

      if (benchmarkConfig == null || libraryConfig == null) {
        return current;
      }

      const { Dot, Box } = libraryConfig;
      const { render, ...benchmarkConfigRest } = benchmarkConfig;

      return (
        current ?? {
          library,
          benchmark,
          value: {
            ...benchmarkConfigRest,
            render: (i) => render({ Dot, Box }, i),
          },
        }
      );
    });
  }, [library, benchmark]);

  const onResult = useCallback((result: IBenchmarkResult) => {
    setConfig((currentConfig) => {
      if (currentConfig != null) {
        setResults((current) => [
          ...current,
          {
            library: currentConfig.library,
            benchmark: currentConfig.benchmark,
            value: result,
          },
        ]);
      }

      return null;
    });
  }, []);

  const onClear = useCallback(() => setResults([]), []);

  return (
    <Page>
      <Output>
        <Benchmark config={config?.value} onResult={onResult} />
      </Output>
      <Input>
        <Actions items={[{ content: <Trash />, tip: 'Clear benchmark results.', onClick: onClear }]} />
        <List>
          {results.map((result, i) => (
            <Result key={i} $library={result.library} $benchmark={result.benchmark} $result={result.value} />
          ))}
        </List>
        <Separator />
        <Form>
          <Select $label={'Library'} items={libraryItems} selectedValue={library} onChange={setLibrary} />
          <Select $label={'Benchmark'} items={benchmarkItems} selectedValue={benchmark} onChange={setBenchmark} />
          <Button onClick={onRun} disabled={config != null}>
            {config != null ? 'Running...' : 'Run'}
          </Button>
        </Form>
      </Input>
    </Page>
  );
}