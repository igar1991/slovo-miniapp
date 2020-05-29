import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";

bridge.subscribe(({detail: {type, data}}) => {
  if (type === 'VKWebAppUpdateConfig') {
  const schemeAttribute = document.createAttribute('scheme');
  schemeAttribute.value = data.scheme ? data.scheme : 'bright_light';
  document.body.attributes.setNamedItem(schemeAttribute);
  //SetScheme(data.scheme);
  }
  });
// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render(<App />, document.getElementById("root"));
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
