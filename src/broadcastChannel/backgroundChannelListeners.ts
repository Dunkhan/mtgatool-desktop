import start from "../background/worker";
import bcConnect from "../utils/bcConnect";
import electron from "../utils/electron/electronWrapper";
import { ChannelMessage } from "./channelMessages";

export default function backgroundChannelListeners() {
  const channel = bcConnect() as any;

  let stopFn: undefined | (() => void);

  channel.onmessage = (msg: MessageEvent<ChannelMessage>) => {
    if (msg.data.type == "START_LOG_READING" && stopFn === undefined) {
      console.log("START LOG READING");
      stopFn = start();
    }

    if (msg.data.type == "STOP_LOG_READING" && stopFn !== undefined) {
      console.log("STOP LOG READING");
      stopFn();
      stopFn = undefined;
    }
  };

  if (electron) {
    electron.ipcRenderer.on("rendererInit", (event: any, d: any) =>
      console.log("rendererInit", d)
    );
  }
}
