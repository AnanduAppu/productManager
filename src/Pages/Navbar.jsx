import React from 'react'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Clintcontex from '../userContex/UserContex'

function Navbar() {
 const{cartLength,setCartLength}=useContext(Clintcontex)
  return (
    <div className='flex bg-slate-400 py-2 px-3 border justify-between'>
        <h1 className='text-2xl font-bold '>Shopi<span className='text-blue-600'>UP</span></h1>
        <Link to='/' className='text-2xl font-semibold text-black'>Products</Link>
        <Link to='cart' className='text-2xl font-semibold text-balck'>Cart({cartLength})</Link>
    </div>
  )
}

export default Navbar