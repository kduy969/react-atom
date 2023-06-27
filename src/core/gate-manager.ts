import { Lock } from "./lock";
import { Emitter } from "./emitter";

// input event stream
// output event if not locked

type Listener = () => void;

export class GateManager {
  lockMap: Map<string, Lock> = new Map();
  lockListenerMap: Map<string, Listener> = new Map();
  outputEventKey: string;
  holdingEvent: any;

  constructor(outputEventKey: string) {
    this.outputEventKey = outputEventKey;
  }

  addLock = (l: Lock, key: string) => {
    const onUnlock = () => {
      this.tryFlush();
    };
    Emitter.on(l.unlockEventKey, onUnlock);

    this.lockListenerMap.set(key, onUnlock);
    this.lockMap.set(key, l);
  };

  removeLock = (key: string) => {
    const lock = this.lockMap.get(key);
    if (!!lock) {
      Emitter.off(lock.unlockEventKey, this.lockListenerMap.get(key));
      this.lockMap.delete(key);
      this.lockListenerMap.delete(key);
      this.tryFlush();
    }
  };

  isLocked = () => {
    const locks = this.lockMap.values();

    let i = locks.next();
    while (!i.done) {
      if (i.value.locked) return true;
      i = locks.next();
    }

    return false;
  };

  input = (event: any) => {
    this.holdingEvent = event;
    this.tryFlush();
  };

  tryFlush = () => {
    if (!this.holdingEvent) return;
    if (!this.isLocked()) {
      this.output(this.holdingEvent);
      this.holdingEvent = null;
    }
  };

  private output = (event: any) => {
    Emitter.emit(this.outputEventKey, event);
  };
}
