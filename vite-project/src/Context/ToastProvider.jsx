import React,{useState} from 'react'
import toastContext from './toastContext'

function ToastProvider({children}) {


const [toastPost, settoastPost] = useState(false)

  return (
    <toastContext.Provider value={{toastPost, settoastPost}} >
        {children}
    </toastContext.Provider>
  )
}

export default ToastProvider

