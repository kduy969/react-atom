import { Channel } from "./channel";

export class Subscriber {
  protected channelMap: {
    [key: string]: {
      listenKey: string;
      channel: Channel<any>;
    };
  } = {};

  subscribe = (channel: Channel<any>, callback: (v: any) => void) => {
    const listenKey = channel.addListener(callback);
    const channelKey = Date.now().toString();
    this.channelMap[channelKey] = {
      listenKey,
      channel,
    };
    return channelKey;
  };

  unsubscribe = (channelKey: string) => {
    const { channel, listenKey } = this.channelMap[channelKey];
    channel?.removeListener(listenKey);
    delete this.channelMap[channelKey];
  };

  unsubscribeAll = () => {
    Object.keys(this.channelMap).forEach((key) => {
      this.unsubscribe(key);
    });
  };

  destroy() {}
}
