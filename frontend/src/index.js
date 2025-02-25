import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import App from "./App";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/scss/custom.scss";
import "assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AppRender = () => {

  return (
    <ThemeContextWrapper>
      <BackgroundColorWrapper>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </BackgroundColorWrapper>
    </ThemeContextWrapper>
  )
}

const root = createRoot(
  document.getElementById('root')
)

root.render(<AppRender />)
