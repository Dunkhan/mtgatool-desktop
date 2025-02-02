import _ from "lodash";

import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/rendererStore";
import upsertDbUserdata from "../toolDb/upsertDbuserdata";
import setLocalSetting from "./setLocalSetting";

export default async function switchPlayerUUID(uuid: string) {
  console.info("switchPlayerUUID", uuid);
  setLocalSetting("playerId", uuid);
  const { dispatch, getState } = store;

  if (getState().mainData.currentUUID !== uuid) {
    reduxAction(dispatch, {
      type: "SET_UUID",
      arg: uuid,
    });

    upsertDbUserdata({ [uuid]: new Date().getTime() });
  }
}
