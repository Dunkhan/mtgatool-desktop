// import "./wdyr";
import "./index.scss";

// eslint-disable-next-line no-use-before-define
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import mainChannelListeners from "./broadcastChannel/mainChannelListeners";
import App from "./components/App";
import reduxAction from "./redux/reduxAction";
import store from "./redux/stores/rendererStore";
import * as serviceWorker from "./serviceWorker";
import { loadDbFromCache } from "./utils/database-wrapper";
import defaultLocalSettings from "./utils/defaultLocalSettings";
import getLocalSetting from "./utils/getLocalSetting";

document.title = "MTG Arena Tool";

defaultLocalSettings();
mainChannelListeners();
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

if (module.hot && process.env.NODE_ENV === "development") {
  module.hot.accept();
  // eslint-disable-next-line global-require
  const NextApp = require("./components/App").default;
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <NextApp />
        </Router>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

loadDbFromCache(getLocalSetting("lang")).then(() =>
  reduxAction(store.dispatch, { type: "FORCE_COLLECTION", arg: undefined })
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
