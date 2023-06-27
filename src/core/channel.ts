//

import { Subscriber } from "./subscriber";
import { GateManager } from "./gate-manager";
import { UuidUtil } from "../utils/uuid-util";
import { Emitter } from "./emitter";
import { Lock } from "./lock";
import { Pipe } from "./pipe/pipe";

export type Listener<T> = (value: T) => void;

// should be Atom implement Subscriber & Channel but TS currently do not support multi inherit
// --> work around: Atom extends Channel extends Subscriber
export class Channel<T> extends Subscriber {
  protected listenerMap: { [key: string]: (value: T) => void } = {};
  protected gateManager: GateManager = new GateManager(UuidUtil.make());
  protected outputPipe?: Pipe<T>;

  constructor() {
    super();
    Emitter.on(this.gateManager.outputEventKey, this.onGateOutput);
  }

  addOutputLock(lock: Lock, key: string) {
    this.gateManager.addLock(lock, key);
  }

  removeOutputLock(key: string) {
    this.gateManager.removeLock(key);
  }

  override destroy() {
    super.destroy();
    Emitter.off(this.gateManager.outputEventKey, this.onGateOutput);
  }

  public addListener = (listener: Listener<T>) => {
    const key = Date.now();
    this.listenerMap[key] = listener;
    return key.toString();
  };

  removeListener = (listenerKey: string) => {
    delete this.listenerMap[listenerKey];
  };

  nofityListeners = (value: T) => {
    this.gateManager.input(value);
  };

  setUpOutputPipe = (pipe: Pipe<any>) => {
    this.outputPipe = pipe;
    this.outputPipe.setOnOutput((v) => {
      this.output(v);
    });
  };

  private onGateOutput = (value: any) => {
    if (this.outputPipe) {
      this.outputPipe.input(value);
    } else this.output(value);
  };

  private output = (value: any) => {
    Object.values(this.listenerMap).forEach(
      (listener) => !!listener && listener(value)
    );
  };

  haveListeners = (): boolean => {
    return Object.keys(this.listenerMap).length > 0;
  };
}

// usage
// const radioChannel = new Channel();
// radioChannel.nofityListeners("123");
