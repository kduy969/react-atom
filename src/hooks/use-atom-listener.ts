import { Atom } from "../core/atom";
import { useEffect, useRef } from "react";

const defaultSelector = (a: any): any => a;

export function useAtomListener<T = any, R = T>(
  atom: Atom<T>,
  callback: (value: T) => void,
  selector?: (a: T) => any
): R {
  if (!selector) selector = defaultSelector;

  const listenerRef = useRef<string>("");
  const valueRef = useRef(selector(atom.get()));
  useEffect(() => {
    listenerRef.current = atom.addListener((newState) => {
      const newValue = selector ? selector(newState) : newState;
      if (newValue !== valueRef.current) {
        valueRef.current = newValue;
        callback(valueRef.current);
      }
    });

    return () => {
      atom.removeListener(listenerRef.current);
    };
  }, []);

  return valueRef.current;
}
