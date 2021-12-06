import { Cards } from "mtgatool-shared";

import reduxAction from "../redux/reduxAction";
import store from "../redux/stores/rendererStore";
import upsertDbCards from "../toolDb/upsertDbCards";
import globalData from "../utils/globalData";
import fetchPlayerId from "./fetchPlayerId";

export default function fetchCards() {
  fetchPlayerId().then(() => {
    if (globalData.daemon) {
      globalData.daemon.getCards().then((cards) => {
        if (cards.length > 0) {
          const parsedCards: Cards = {};
          cards.forEach((c) => {
            parsedCards[c.grpId] = c.owned;
          });

          upsertDbCards(parsedCards);
          reduxAction(store.dispatch, {
            type: "SET_CARDS",
            arg: parsedCards,
          });
        }
      });
    }
  });
}
