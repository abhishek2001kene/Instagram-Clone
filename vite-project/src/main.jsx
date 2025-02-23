import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./Redux/store.js";
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import PopupProvider from "./Context/PopupProvider"
import ToastProvider from "./Context/ToastProvider"




let persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <PopupProvider>
        <ToastProvider>
        <App />
        </ToastProvider>
      </PopupProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
