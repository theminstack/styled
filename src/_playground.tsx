/* eslint-disable */
import React, { Component, ReactNode } from 'react';
import { styled, createTheme, InferProps } from '.';
import { Defaults, Merge } from './types/Utilities';

// Styled

function Foo(props: { className?: string; bar: number }): null {
  return null;
}

function Bar(props: { foo?: number }): null {
  return null;
}

class Baz extends Component<{ className?: string }> {
  render(): ReactNode {
    return null;
  }
}

const A = styled('a')
  .use<{ z?: number }>((props) => ({ z: 1 }))
  .use((props) => ({ className: '' }))
  .set((props) => ({}))
  .set((props) => ({ a: 1 }))
  .map((props) => ({ ...props, z: 1 }))
  .map((props) => ({ z: 1 }))`
    color: blue;
  `;

const B = styled(Foo, 'Foo')
  .use<{ z?: number }>((props) => ({ z: 1 }))
  .use((props) => ({ className: '', z: '' }))
  .set((props) => ({}))
  .set((props) => ({ a: 1 }))
  .map((props) => ({ ...props, z: 1 }))
  .map((props) => ({ z: 1, bar: 1 }))
  .map((props) => ({ bar: 1, className: '' }))`
    color: blue;
  `;

const C = styled(Baz, 'Baz')
  .use<{ z?: number }>((props) => ({ z: 1 }))
  .use((props) => ({ className: '' }))
  .set((props) => ({ className: '', a: 1 }))
  .map((props) => props)
  .map((props) => ({ ...props, z: 1, className: '' }))`
    color: blue;
  `;

const D = styled<{ className: string; bar: number }, 'IKnowWhatIAmDoing'>(Foo)`
  color: blue;
`;

styled(Foo)
  .set(() => ({ className: undefined }))
  .set((props) => ({}));

styled(Foo).set<{ a: number }>(() => ({ a: 1 }));
styled(Foo).map<{ className?: string; bar: number }>(() => ({ className: '', bar: 1, a: '' }));
styled(Foo).map<{ bar: number }>((props) => ({ ...props }));
styled(Bar, '');
styled<{ className?: string; bar: number }>(Foo);

// Theming

const [useTheme, ThemeProvider] = createTheme({
  colorInputBorder: 'black',
  colorInputBorderFocus: 'blue',
});

type ThemeType = ReturnType<typeof useTheme>;

interface ITextInputProps extends InferProps<'input'> {
  type?: 'text' | 'password' | 'email' | 'date' | 'datetime-local' | 'month' | 'number';
  theme?: ThemeType;
  $size?: 'small' | 'large';
}

const TextInput = styled('input', 'TextInput')
  .props<ITextInputProps>()
  .use(() => ({
    theme: useTheme(),
    $size: 'small' as const,
    type: 'text' as const,
  }))`
    color: inherit;
    background: transparent;
    width: ${({ $size }) => ($size === 'small' ? '32rem' : '16rem')};
    border-width: 0 0 1px 0;
    border-color: ${({ theme }) => theme.colorInputBorder};
    &:focus {
      border-color: ${({ theme }) => theme.colorInputBorderFocus};
    }
  `;

const SignatureInput = styled(TextInput)
  .props<Omit<ITextInputProps, 'type'>>()
  .set(() => ({ type: 'text' }))`
    font-family: cursive;
  `;

const Form = styled('form')`
  ${TextInput}, ${SignatureInput} {
    margin: 1em;
  }
`;

const GlobalStyle = styled('style')``;

<>
  <GlobalStyle />
  <Form onSubmit={() => undefined}>
    <TextInput name={'text'} />
    <SignatureInput name={'signature'} className={''} />
  </Form>
</>;

const M = styled('a')
  .props((props: { foo?: string }) => ({ 'data-test': '', foo: props.foo }))
  .use(() => ({
    className: '',
  }))`
    color: ${(props) => props.foo ?? props['data-test']};
  `;

// Utility types

interface IFoo0 {
  a: string;
  b?: string;
  c: string | undefined;
  d: string | undefined;
  e: number;
  f: string | undefined;
}

interface IBar0 {
  a: number;
  b?: number;
  c: number | undefined;
  d: string;
  e: string | undefined;
  f: number;
}

type DefaultsFoo = Defaults<[IFoo0, IBar0]>;
type MergeFoo = Merge<[IFoo0, IBar0]>;
