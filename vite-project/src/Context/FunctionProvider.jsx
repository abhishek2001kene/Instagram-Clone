import React from 'react'
import functionContext from "../Context/functionContext.js"

function FunctionProvider({children}) {


  



  return (
    <functionContext.Provider>
        {children}
    </functionContext.Provider>
  )
}

export default FunctionProvider




