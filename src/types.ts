import { DependencyList, Dispatch, EffectCallback, SetStateAction } from 'react';

export type UseState<S> = (initialState: S | (() => S)) => [S, Dispatch<SetStateAction<S>>];

export type UseEffect = (effect: EffectCallback, deps?: DependencyList) => void;
