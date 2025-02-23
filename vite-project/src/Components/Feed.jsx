import React,{useContext} from 'react'
import Posts from './Posts'
import CraetePostPopup from "../Components/CraetePostPopup.jsx"
import popupContext from "../Context/popupContext.js"




function Feed() {

  const {showPopup } = useContext(popupContext)
  
  return (
    <div className='flex-1 flex flex-col md:my-8 items-center md:pl-40 '>
       {
  showPopup && 
    <CraetePostPopup>
      jhohjpolj
    </CraetePostPopup>
  
}
      
        <Posts />
    </div>
  )
}

export default Feed