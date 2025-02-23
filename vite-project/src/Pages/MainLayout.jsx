import React,{useState, useContext} from 'react'
import Sidebar from '../Components/Sidebar'
import { Outlet } from 'react-router-dom'




function MainLayout() {




  return (
    <div className='bg-gray-900 text-slate-200 h-full' >

   


       <div >
        <Sidebar/>
       </div> 
     
      

        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout

