import { Emitter } from "./emitter";
import { UuidUtil } from "../utils/uuid-util";

export class Lock {
  public locked = false;
  unlockEventKey = UuidUtil.make();

  constructor() {}

  public lock = () => {
    this.locked = true;
  };

  public unlock = () => {
    this.locked = false;
    Emitter.emit(this.unlockEventKey, "");
  };
}
