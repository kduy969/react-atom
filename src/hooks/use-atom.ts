import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import { Atom, ExtractAtom } from "../core/atom";
import { ComposeAtom } from "../core/compose-atom";

const defaultSelector = (v: any) => v;

export type TSelector<T = any> = (v: T) => any;

// export function useAtom<T, R = T>(
//   atom: undefined,
//   selector?: (v: T) => R
// ): [undefined, undefined];
// export function useAtom<T, R = T>(
//   atom: Atom<T>,
//   selector?: (v: T) => R
// ): [R, (v: T) => void];
// export function useAtom<T, R = T>(
//   atom: Atom<T> | undefined,
//   selector: (v: T) => R = defaultSelector
// ): any {
//   const listenerKeyRef = useRef<string>();
//   const valueRef = useRef(atom ? selector(atom?.get()) : undefined);
//   const [_, refresh] = useState<any>(null);
//
//   const onNewValue = (newState: T) => {
//     const newValue = selector(newState);
//     if (newValue !== valueRef.current) {
//       valueRef.current = newValue;
//       refresh(Date.now());
//     }
//   };
//
//   useEffect(() => {
//     if (!atom) return;
//
//     onNewValue(atom.get());
//     listenerKeyRef.current = atom.addListener(onNewValue);
//
//     return () => {
//       if (!!listenerKeyRef.current) atom.removeListener(listenerKeyRef.current);
//     };
//   }, [atom]);
//
//   return [valueRef.current, atom?.set];
// }

export function useAtom<A extends Atom | undefined, T = ExtractAtom<A>, R = T>(
  atom: A,
  selector: (v: T) => R = defaultSelector
): A extends undefined ? [undefined, undefined, undefined] : [R, (v: T) => void, A] {
  const listenerKeyRef = useRef<string>();
  const valueRef = useRef(atom ? selector(atom?.get()) : undefined);
  const [_, refresh] = useState<any>(null);

  const onNewValue = (newState: T) => {
    const newValue = selector(newState);
    if (newValue !== valueRef.current) {
      valueRef.current = newValue;
      refresh(Date.now());
    }
  };

  useEffect(() => {
    if (!atom) return;

    onNewValue(atom.get());
    listenerKeyRef.current = atom.addListener(onNewValue);

    return () => {
      if (!!listenerKeyRef.current) atom.removeListener(listenerKeyRef.current);
    };
  }, [atom]);

  // reserve atom.set() binding (to always point to atom)
  const set = useCallback((v: T) => {
    return atom?.set(v);
  }, [atom?.set]);

  if (atom === undefined) {
    // probably typescript bug
    // @ts-ignore
    return [undefined, undefined, undefined];
  }

  // probably typescript bug
  // @ts-ignore
  return [valueRef.current, set, atom];
}
