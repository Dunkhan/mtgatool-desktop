// import "./wdyr";
import "./index.scss";

// eslint-disable-next-line no-use-before-define
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import backgroundChannelListeners from "./broadcastChannel/backgroundChannelListeners";
import mainChannelListeners from "./broadcastChannel/mainChannelListeners";
import App from "./components/App";
import MtgaTrackerDaemon from "./daemon/mtgaTrackerDaemon";
import Hover from "./hover";
import Overlay from "./overlay";
import reduxAction from "./redux/reduxAction";
import store from "./redux/stores/rendererStore";
import * as serviceWorker from "./serviceWorker";
import {
  ALL_OVERLAYS,
  WINDOW_BACKGROUND,
  WINDOW_HOVER,
  WINDOW_UPDATER,
} from "./types/app";
import Updater from "./updater";
import { loadDbFromCache } from "./utils/database-wrapper";
import defaultLocalSettings from "./utils/defaultLocalSettings";
import getWindowTitle from "./utils/electron/getWindowTitle";
import getLocalSetting from "./utils/getLocalSetting";
import globalData from "./utils/globalData";
import initDirectories from "./utils/initDirectories";
import registerShortcuts from "./utils/registerShortcuts";

const title = getWindowTitle();

if (title == WINDOW_UPDATER) {
  ReactDOM.render(
    <React.StrictMode>
      <Updater />
    </React.StrictMode>,
    document.getElementById("root")
  );
} else if (title == WINDOW_BACKGROUND) {
  (window as any).daemon = new MtgaTrackerDaemon(false);

  initDirectories();
  if (module.hot && process.env.NODE_ENV === "development") {
    module.hot.accept();
  }
  backgroundChannelListeners();
} else if (title == WINDOW_HOVER) {
  defaultLocalSettings();
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Hover />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );

  if (module.hot && process.env.NODE_ENV === "development") {
    module.hot.accept();
    // eslint-disable-next-line global-require
    const NextHover = require("./hover/index").default;
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <NextHover />
        </Provider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  }
} else if (ALL_OVERLAYS.includes(title)) {
  defaultLocalSettings();
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Overlay />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );

  if (module.hot && process.env.NODE_ENV === "development") {
    module.hot.accept();
    // eslint-disable-next-line global-require
    const NextOverlay = require("./overlay/index").default;
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <NextOverlay />
        </Provider>
      </React.StrictMode>,
      document.getElementById("root")
    );
  }
} else {
  defaultLocalSettings();

  const settings = JSON.parse(getLocalSetting("settings"));
  registerShortcuts(settings);

  globalData.daemon = new MtgaTrackerDaemon();

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
}

if (title !== WINDOW_UPDATER) {
  loadDbFromCache(getLocalSetting("lang")).then(() =>
    reduxAction(store.dispatch, { type: "FORCE_COLLECTION", arg: undefined })
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
