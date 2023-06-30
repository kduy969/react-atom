import { useEffect, useRef } from "react";
import { Atom } from "../core/atom";
import { useAtom } from "./use-atom";

export function useCreateAtom<T>(value: T) {
  const atomRef = useRef<Atom<T>>();
  if(!atomRef.current) {
    atomRef.current = new Atom<T>(value);
  }
  useEffect(() => {
    // cleanup atom ??
  }, []);

  return useAtom(atomRef.current);
}
