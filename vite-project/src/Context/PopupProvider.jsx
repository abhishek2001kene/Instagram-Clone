import React, { useState } from "react";
import popupContext from "../Context/popupContext.js";

function PopupProvider({ children }) {
  const [showPopup, setshowPopup] = useState(false); 

  return (
    <popupContext.Provider value={{ showPopup, setshowPopup }}>
      {children}
    </popupContext.Provider>
  );
}

export default PopupProvider;
