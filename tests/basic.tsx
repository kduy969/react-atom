import React from "react";
import { useCreateAtom } from "../src/hooks/use-create-atom";

type Props = {}

const Basic = ({}: Props) => {
  const [count, setCount] = useCreateAtom(0);
  return (
    <section>
      <p data-testid={'count'}>
        Count is {count}
      </p>
      <button onClick={() => {
        setCount(count + 1);
      }}>
        Increase count by 1
      </button>
    </section>
  );
};

export default React.memo(Basic);
