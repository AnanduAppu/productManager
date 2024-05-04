import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import Clintcontex from "../userContex/UserContex";

function ShoppingCart() {
  const { setCart, cart,setCartLength } = useContext(Clintcontex);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [showFirst, setShowFirstError] = useState(false);
  const [showLast, setShowLastError] = useState(false);
  const [showAddress, setShowAddressError] = useState(false);


  // handle first name input and must contain 4 letter in this input
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    if (firstName.trim().length < 4 && firstName.trim().length >0) {
      setShowFirstError(true);
    } else {
      setShowFirstError(false);
    }
  };


   // handle last name input and must contain 1 letter in this input
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    if (lastName.trim().length < 1  && lastName.trim().length >0) {
      setShowLastError(true);
    } else {
      setShowLastError(false);
    }
  };

  // handle address input and must contain 10 letter in this input
  const handleAddressChange = (event) => {
    setAddress(event.target.value );
    if (address.trim().length < 1 && address.trim().length >0) {
      setShowAddressError(true);
    } else {
      setShowAddressError(false);
    }
  };

//remove item from the cart page
  const removeItem = (id) => {
    const filteredCart = cart.filter((item) => item._id !== id);
    setCart(filteredCart);
    setCartLength(filteredCart.length)

  };

  //give total price of all items in the cart
  const calculateTotal = () => {
    if(cart.length==0){
      return 0
    }else{
      const total = cart
      .reduce((total, product) => total + product.total, 0)
      .toFixed(2);

      return total;
    }

  };


  //add quantity from the  cart
  const addQuantity = (product) => {
    const price = product.price;
    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1, total: item.total + price }
          : item
      );
      setCart(updatedCart);
    } 
  };


  // remove quantity form the cart
  const removeQuantity = (product) => {
    const price = product.price;
    const existingProduct = cart.find((item) => item._id === product._id);

    if (existingProduct && existingProduct.quantity > 1) {
      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity - 1, total: item.total - price }
          : item
      );
      setCart(updatedCart);
      
    }
  };


  //placing order and validating inputs of address form and send to backend from their we get a response
  const handleOrder = async () => {
    const total = calculateTotal();
    if (cart.length !== 0) {
      if (
        firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        address.trim() !== ""
      ) {
        try {
          const response = await axios.post(
            "http://localhost:3065/product/placeorder",
            { firstName, lastName, address, cart, total }
          );
          if (response.data.success) {
            toast.success("order success");
            console.log("your order data:- ",response.data.orderDetails);
            setCart([]);
            setCartLength('')
           
          }
        } catch (error) {
           // Show error message 
          console.log("error in order details,;- ", error);
        }
      } else {
        // Show adress error message
        toast.error("Please fill in all address fields");
      }
    } else {
      // Show cart is empty cant orde now
      toast.error("no cart items");
    }
  };

  return (
    <div className="bg-gray-100 h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/4">
            {cart.length == 0 ? (
              <h1 className="text-center py-5 text-2xl">No items</h1>
            ) : (
              <div>
                {cart.map((ele) => (
                  <div
                    className="bg-white rounded-lg shadow-md p-6 mb-4"
                    key={ele._id}
                  >
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left font-semibold">Product</th>
                          <th className="text-left font-semibold">Price</th>
                          <th className="text-left font-semibold">Quantity</th>
                          <th className="text-left font-semibold">Total</th>
                          <th className="text-left font-semibold"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-4">
                            <div className="flex items-center">
                              <img
                                className="h-16 w-16 mr-4"
                                src={ele.image}
                                alt="Product image"
                              />
                              <span className="font-semibold">{ele.name}</span>
                            </div>
                          </td>
                          <td className="py-4">${ele.price}</td>
                          <td className="py-4">
                            <div className="flex items-center">
                              <button
                                className="border rounded-md py-2 px-4 mr-2"
                                onClick={() => removeQuantity(ele)}
                              >
                                -
                              </button>
                              <span className="text-center w-8">
                                {ele.quantity}
                              </span>
                              <button
                                className="border rounded-md py-2 px-4 ml-2"
                                onClick={() => addQuantity(ele)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-4">${ele.total.toFixed(2)}</td>
                          <td className="py-4">
                            <button onClick={ ()=>removeItem (ele._id)} className="text-red-500 hover:text-red-700 duration-500">remove</button>
                          </td>
                        </tr>
                        {/* More product rows */}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>

              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                ${calculateTotal()}
              </div>

              {/* Address form */}
              <div className="mx-auto w-full md:w-96 md:max-w-full">
                <div className="border border-gray-300 p-6 sm:rounded-md">
                  <h1 className="text-center text-lg font-semibold">
                    Add Address
                  </h1>

                  <form>
                    <label className="mb-6 block">
                      <span className="text-gray-700">First name</span>
                      {showFirst && (
                        <p className="text-red-400 text-sm my-1 ">
                          must contain at least 4 letters
                        </p>
                      )}
                      <input
                        type="text"
                        value={firstName}
                        onChange={handleFirstNameChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="First Name"
                        required
                      />
                    </label>
                    <label className="mb-6 block">
                      {showLast && (
                        <p className="text-red-400 text-sm my-1 ">
                          must contain at least 1 letters
                        </p>
                      )}
                      <span className="text-gray-700">Last name</span>
                      <input
                        type="text"
                        value={lastName}
                        onChange={handleLastNameChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Last name"
                        required
                      />
                    </label>
                    <label className="mb-6 block">
                      {showAddress && (
                        <p className="text-red-400 text-sm my-1 ">
                          must contain at least 10 letters
                        </p>
                      )}
                      <textarea
                        value={address}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Address"
                        required
                      />
                    </label>
                  </form>
                </div>
              </div>

              {/* order palcing button button */}
              <button
                onClick={handleOrder}
                className={`bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full hover:bg-blue-700 duration-500`}
              >
                Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
