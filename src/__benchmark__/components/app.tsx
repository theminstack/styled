import { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Trash } from 'react-feather';

import { benchmarks } from '../benchmarks';
import { libraries } from '../libraries';
import { Actions } from './actions';
import { type BenchmarkResult, Benchmark } from './benchmark';
import { Button } from './button';
import { Form } from './form';
import { Input } from './input';
import { List } from './list';
import { Output } from './output';
import { Page } from './page';
import { Result } from './result';
import { type SelectItem, Select } from './select';
import { Separator } from './separator';

const benchmarkItems = [
  ...Object.keys(benchmarks).reduce<readonly SelectItem[]>(
    (result, key) => [...result, { value: benchmarks[key].name }],
    [],
  ),
].sort((a, b) => (a.label ?? a.value).localeCompare(b.label ?? b.value));
const libraryItems = libraries.map((library) => ({ value: library.name as typeof library['name'] }));

const App = (): ReactElement => {
  const [library, setLibrary] = useState<typeof libraries[number]['name']>(libraryItems[0].value);
  const [results, setResults] = useState<
    { readonly benchmark: string; readonly library: string; readonly value: BenchmarkResult }[]
  >([]);
  const [benchmark, setBenchmark] = useState<string | undefined>(benchmarkItems[0]?.value);
  const config = useMemo(() => {
    if (benchmark == null) {
      return null;
    }

    const benchmarkConfig = benchmarks[benchmark];
    const libraryConfig = libraries.find((item) => item.name === library);

    if (benchmarkConfig == null || libraryConfig == null) {
      return null;
    }

    const { Dot, Box } = libraryConfig;
    const { render, ...benchmarkConfigRest } = benchmarkConfig;

    return {
      benchmark,
      library,
      value: {
        ...benchmarkConfigRest,
        render: (index: number) => render({ Box, Dot }, index),
      },
    };
  }, [library, benchmark]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsRunning(false);
  }, [config, benchmark, library]);

  const onRun = useCallback(() => {
    setIsRunning(true);
  }, []);

  const onResult = useCallback(
    (result: BenchmarkResult) => {
      if (!isRunning || config == null) {
        return;
      }

      setIsRunning(false);
      setResults((current) => [
        ...current,
        {
          benchmark: config.benchmark,
          library: config.library,
          value: result,
        },
      ]);
    },
    [isRunning, config],
  );

  const onClear = useCallback(() => setResults([]), []);

  return (
    <Page>
      <Output>
        {config && isRunning ? <Benchmark config={config.value} onResult={onResult} /> : config?.value.render(0)}
      </Output>
      <Input>
        <Actions items={[{ content: <Trash />, onClick: onClear, tip: 'Clear benchmark results.' }]} />
        <List>
          {results.map((result, index) => (
            <Result key={index} $library={result.library} $benchmark={result.benchmark} $result={result.value} />
          ))}
        </List>
        <Separator />
        <Form>
          <Select
            $label={'Library'}
            items={libraryItems}
            selectedValue={library}
            disabled={isRunning}
            onChange={setLibrary as any}
          />
          <Select
            $label={'Benchmark'}
            items={benchmarkItems}
            selectedValue={benchmark}
            disabled={isRunning}
            onChange={setBenchmark as any}
          />
          <Button onClick={onRun} disabled={config == null || isRunning}>
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </Form>
      </Input>
    </Page>
  );
};

export { App };
