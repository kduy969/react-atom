type OnOutput<O> = (i: O) => void;

export class Pipe<I, O = I> {
  onOutput?: OnOutput<O>;

  input(i: I) {
    this.output(i as unknown as O);
  }

  protected output(o: O) {
    this.onOutput?.(o);
  }

  setOnOutput(onOutput: OnOutput<O>) {
    this.onOutput = onOutput;
  }
}

///onOutputMap: Map<string, OnOutput> = new Map<string, OnOutput>();
//
//   input(i: I) {
//     this.output(i as unknown as O)
//   }
//
//   protected output(o: O) {
//     for (let onOutput of this.onOutputMap.values()) {
//       onOutput(o);
//     }
//   }
//
//   addOnOutput(key: string, onOutput: OnOutput<O>) {
//     this.onOutputMap.set(key, onOutput);
//   }
//
//   removeOnOutput(key: string) {
//     this.onOutputMap.delete(key);
//   }
//
//   connect(p: Pipe<any, any>) {
//
//   }
