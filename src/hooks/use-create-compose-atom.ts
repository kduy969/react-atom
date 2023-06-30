import { useEffect, useMemo, useRef } from "react";
import { Atom } from "../core/atom";
import { useAtom } from "./use-atom";
import { Pipe } from "../core/pipe/pipe";
import { AtomSelector, ComposeAtom, ComposeSelector } from "../core/compose-atom";

// create compose atom
// changing parameters after initializing will not update the atom
export function useCreateComposeAtom<T>(...params: ConstructorParameters<typeof ComposeAtom>) {
  const atom = useMemo(
    () => (
      new ComposeAtom<T>(...params)
    ),
    []
  );
  return useAtom(atom);
}



