/* eslint-disable no-param-reassign */
import _ from "lodash";

import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/rendererStore";
import globalData from "../utils/globalData";

export default async function setDbHiddenDecks(
  hiddenDecks: string[] | undefined = undefined
) {
  const newDecks = hiddenDecks || globalData.hiddenDecks;
  window.toolDb.putData<string[]>(`hiddenDecks`, newDecks, true);

  globalData.hiddenDecks = newDecks;
  reduxAction(store.dispatch, {
    type: "SET_HIDDEN_DECKS",
    arg: newDecks,
  });
}
