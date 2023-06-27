import { Channel, Listener } from "./channel";
import { Lock } from "./lock";
import { UuidUtil } from "../utils/uuid-util";

export class Atom<T = any> extends Channel<T> {
  public static globalLock: Lock = new Lock();
  public static globalLockKey = UuidUtil.make();

  private value;

  constructor(initialValue: T) {
    super();
    this.addOutputLock(Atom.globalLock, Atom.globalLockKey);
    this.value = initialValue;
  }

  set(value: T) {
    if (this.value === value) return;
    this.value = value;
    this.nofityListeners(this.value);
  };

  get(): T {
    return this.value;
  };
}

export type ExtractAtom<A> = A extends Atom<infer T> ? T : never;
