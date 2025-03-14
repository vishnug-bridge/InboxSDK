/* eslint-disable no-undef */
import * as InboxSDK from '@inboxsdk/core';

InboxSDK.load(2, 'sdk_newstud_7bb12ef34f').then(function (sdk) {
  window._sdk = sdk;
  
  sdk.AppMenu.addMenuItem({
    name: 'custom',
    iconUrl: {
      lightTheme: chrome.runtime.getURL('monkey-face.jpg'),
      darkTheme: chrome.runtime.getURL('monkey-face.jpg'),
    },
    routeID: 'custom',
  });

  sdk.Router.handleCustomRoute('custom', function (customRouteView) {
    customRouteView.getElement().innerHTML = `<div style='color:white'>custom</div>`;
  });

  sdk.AppMenu.addMenuItem({
    name: 'beep',
    iconUrl: {
      lightTheme: chrome.runtime.getURL('monkey-face.jpg'),
      darkTheme: chrome.runtime.getURL('monkey-face.jpg'),
    },
    routeID: 'beep',
  });

  sdk.Router.handleCustomRoute('beep', function (customRouteView) {
    customRouteView.getElement().innerHTML = `<div style='color:white'>beep</div>`;
  });
});
