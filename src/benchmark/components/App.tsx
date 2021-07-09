import React, { ReactElement, useCallback, useState } from 'react';
import { Trash } from 'iconoir-react';
import Input from './Input';
import Output from './Output';
import Page from './Page';
import Benchmark, { IBenchmarkConfig, IBenchmarkResult } from './Benchmark';
import List from './List';
import Form from './Form';
import Separator from './Separator';
import Button from './Button';
import Select, { ISelectItem } from './Select';
import Result from './Result';
import Actions from './Actions';
import libraryConfigs from '../libraries';
import benchmarkConfigs from '../benchmarks';

const benchmarkItems = Object.keys(benchmarkConfigs)
  .reduce<ISelectItem[]>((acc, key) => [...acc, { value: benchmarkConfigs[key].name }], [])
  .sort((a, b) => (a.label ?? a.value).localeCompare(b.label ?? b.value));
const libraryItems = Object.keys(libraryConfigs)
  .reduce<ISelectItem[]>((acc, key) => [...acc, { value: libraryConfigs[key].name }], [])
  .sort((a, b) => (a.label ?? a.value).localeCompare(b.label ?? b.value));

export default function App(): ReactElement {
  const [library, setLibrary] = useState(libraryItems[0]?.value ?? '');
  const [benchmark, setBenchmark] = useState(benchmarkItems[0]?.value ?? '');
  const [config, setConfig] = useState<{ library: string; benchmark: string; value: IBenchmarkConfig } | null>(null);
  const [results, setResults] = useState<{ library: string; benchmark: string; value: IBenchmarkResult }[]>([]);

  const onRun = useCallback(() => {
    setConfig((current) => {
      if (current) {
        return current;
      }

      const benchmarkConfig = benchmarkConfigs[benchmark];
      const libraryConfig = libraryConfigs[library];

      if (!benchmarkConfig || !libraryConfig) {
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
      if (currentConfig) {
        const { library, benchmark } = currentConfig;

        setResults((current) => [
          ...current,
          {
            library,
            benchmark,
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
          {results.map(({ library, benchmark, value }, i) => (
            <Result key={i} $library={library} $benchmark={benchmark} $result={value} />
          ))}
        </List>
        <Separator />
        <Form>
          <Select $label={'Library'} items={libraryItems} value={library} onChange={setLibrary} />
          <Select $label={'Benchmark'} items={benchmarkItems} value={benchmark} onChange={setBenchmark} />
          <Button onClick={onRun} disabled={config != null}>
            {config ? 'Running...' : 'Run'}
          </Button>
        </Form>
      </Input>
    </Page>
  );
}
