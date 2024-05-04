import { Routes, Route, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import Clintcontex from "./userContex/UserContex";
import Assemblepage from "./Pages/Assemblepage";
import ProductListing from "./Pages/ProductListing";
import ShoppingCart from "./Pages/CartPage";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
function App() {

const [productData,setProductData]=useState([]) // for storing product datas from backend apis
const [cartLength,setCartLength]=useState(Number)//for showing the count of cart
const [cart,setCart]=useState([])// which carry the list products which added in the cart 

  useEffect(() => {
const fetchData = async()=>{
try {
  const response = await axios.get('http://localhost:3065/product/productData')
  if(response.data.success){
    setProductData(response.data.Data)
  }
} catch (error) {
  console.log("the error from product listing api:-",error)
}
}

fetchData()
  }, []);


  const data={
    productData,setProductData,
    cartLength,setCartLength,
    cart,setCart
  }
  return (
    <>
    <Toaster />
      <Clintcontex.Provider value={data}>
      <Routes>
      <Route path="/" element={<Assemblepage />}>
      <Route index element={<ProductListing />} />
      <Route path="cart" element={<ShoppingCart />} />
      </Route>
          
      </Routes>
      </Clintcontex.Provider>
    </>
  )
}

export default App
