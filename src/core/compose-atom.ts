import { Atom } from "./atom";
import { Pipe } from "./pipe/pipe";

const defaultSelector = (a: any): any => a;

type AtomSelector<T = any, R = T> = ((t: T) => R) | undefined | null;
type ComposeSelector = (...args: any) => any;

const getParams = (atoms: Array<Atom>, selectors: Array<AtomSelector>) => {
  const params = atoms.map((atom, index) =>
    (selectors[index] || defaultSelector)(atom.get())
  );
  return params;
};

export class ComposeAtom<T = any> extends Atom<T> {
  atoms: Array<Atom> = [];
  selectors: Array<AtomSelector> = [];
  params!: Array<any>;
  outdated: boolean = false;
  composeSelector: ComposeSelector = () => undefined;
  recalculatePipe?: Pipe<any>;

  constructor(
    atoms: Array<Atom>,
    selectors: Array<AtomSelector>,
    composeSelector: ComposeSelector,
    recalculatePipe?: Pipe<any>
  ) {
    const params = getParams(atoms, selectors);
    const value = composeSelector(...params);
    super(value);
    this.recalculatePipe = recalculatePipe;
    this.recalculatePipe?.setOnOutput(this.doRecalculateAndUpdate);
    this.params = params;
    this.atoms = atoms;
    this.selectors = selectors;
    this.composeSelector = composeSelector;
    this.subscribeToAtoms();
  }

  get(){
    if (this.outdated) this.requestRecalculateAll();
    return super.get();
  };

  private subscribeToAtoms = () => {
    this.atoms.forEach((atom, index) => {
      this.subscribe(atom, (v) => {
        this.onReceiveAtomUpdate(v, index);
      });
    });
  };

  private onReceiveAtomUpdate = (value: any, atomIndex: number) => {
    if (!this.haveListeners()) {
      // stop calculate new update -> outdated
      this.outdated = true;
      return;
    }

    if (this.outdated) {
      this.outdated = false;
      this.requestRecalculateAll();
    } else {
      const newValue = (this.selectors[atomIndex] || defaultSelector)(value);
      this.requestRecalculate(newValue, atomIndex);
    }
  };

  requestRecalculate = (atomValue: any, atomIndex: number) => {
    this.params[atomIndex] = atomValue; //  only recalculate updated atom, reuse other params
    this.sendNewRecalculateEvent(this.params);
  };

  requestRecalculateAll = () => {
    const params = getParams(this.atoms, this.selectors);
    this.params = params;
    this.sendNewRecalculateEvent(params);
  };

  sendNewRecalculateEvent = (params: any[]) => {
    console.log("sendNewRecalculateEvent");
    if (!!this.recalculatePipe) {
      this.recalculatePipe.input(params);
    } else {
      // execute immediately
      this.doRecalculateAndUpdate(params);
    }
  };

  doRecalculateAndUpdate = (params: any[]) => {
    console.log("doRecalculateAndUpdate", params);
    const newValue = this.composeSelector(...params);
    this.set(newValue);
  };
}
