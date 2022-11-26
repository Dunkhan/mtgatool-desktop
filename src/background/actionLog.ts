import format from "date-fns/format";

import postChannelMessage from "../broadcastChannel/postChannelMessage";
import globalStore from "./store";

const actionLog = (
  seat: number,
  time = new Date(),
  str: string,
  _grpId = 0
): void => {
  if (seat == -99) {
    globalStore.currentActionLog = "version: 1\r\n";
  } else {
    // const parsedStr = str.replace(/(<([^>]+)>)/gi, "");

    globalStore.currentActionLog += `${seat}\r\n`;
    globalStore.currentActionLog += `${format(time, "HH:mm:ss")}\r\n`;
    globalStore.currentActionLog += `${str}\r\n`;

    postChannelMessage({
      type: "ACTION_LOG",
      value: globalStore.currentActionLog,
    });
  }
};

export default actionLog;
