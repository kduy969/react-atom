import React from "react";
import { useCreateAtom } from "../src/hooks/use-create-atom";
import { useCreateComposeAtom } from "../src/hooks/use-create-compose-atom";

type Props = {}

const Compose = ({}: Props) => {
  const [a, setA, atomA] = useCreateAtom(0);
  const [b, setB, atomB] = useCreateAtom(0);
  const [sum] = useCreateComposeAtom<number>(
    [atomA, atomB],
    null,
    (a: number, b: number) => {
      console.log("calculate A + B");
      return a + b;
    },
  )
  return (
    <section>
      <p data-testid={'a'}>
        {a}
      </p>
      <p data-testid={'b'}>
        {b}
      </p>
      <p data-testid={'sum'}>
        {sum}
      </p>
      <button data-testid={'increaseA'} onClick={() => {
        setA(a + 1);
      }}>
        Increase a
      </button>
      <button data-testid={'increaseB'} onClick={() => {
        setB(b + 1);
      }}>
        Increase b
      </button>
    </section>
  );
};

export default React.memo(Compose);
