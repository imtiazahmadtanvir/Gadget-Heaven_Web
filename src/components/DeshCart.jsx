import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { getToCart, removeToCart } from '../utilities/Data';
import { TiDeleteOutline } from "react-icons/ti";
import Modal from '../components/Modal';
import { PiSliders } from "react-icons/pi";
import Swal from 'sweetalert2';

const DeshCart = () => {
    const [cartList, setCartList] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

    const allCart = useLoaderData();

    useEffect(() => {
        const storedCart = getToCart();

        const filterCartList = allCart.filter(cart => (
            storedCart.includes(cart.product_id)
        ));

        setCartList(filterCartList);

        const total = filterCartList.reduce((acc, cartItem) => acc + cartItem.price, 0);
        setTotalCost(total);

        if (filterCartList.length === 0) {
            setIsPurchaseOpen(true);
        } else {
            setIsPurchaseOpen(false);
        }

    }, [allCart]);

    const handleSortByPrice = () => {
        const sortedCart = [...cartList].sort((a, b) => b.price - a.price);
        setCartList(sortedCart);
    };

    const handlePurchaseProduct = () => {
        setTotalCost(0);
        const total = cartList.reduce((acc, cartItem) => acc + cartItem.price, 0);
        setTotalCost(total);
        setCartList([]);
        localStorage.removeItem('cart-item');
        setIsModalOpen(true);
        setIsPurchaseOpen(true);
    };

    const handleAddToCart = (item) => {
        setCartList(prevCartList => [...prevCartList, item]);
        setIsPurchaseOpen(false); // Re-enable the Purchase button

        // Show SweetAlert success message when item is added to cart
        Swal.fire({
            title: 'Success!',
            text: `${item.product_title} has been added to your cart.`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    };

    const handleRemoveToCart = (product_id) => {
        removeToCart(product_id);
        const updatedCartList = cartList.filter(cartItem => cartItem.product_id !== product_id);
        setCartList(updatedCartList);

        const newTotal = updatedCartList.reduce((acc, cartItem) => acc + cartItem.price, 0);
        setTotalCost(newTotal);
        
        if (updatedCartList.length === 0) {
            setIsPurchaseOpen(true);
        }
    };

    // Fallback default image URL
    // const defaultImage = 'https://i.ibb.co.com/Z8xDhDJ/apple-iphone-15-pro-max-1.jpg'; // Set your default image path here

    return (
        <div className='w-11/12 2xl:w-4/5 mx-auto mt-12'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
                <h2 className='text-xl font-bold'>Cart</h2>
                <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
                    <h2 className='text-xl font-bold'>Total cost: {totalCost}</h2>
                    <button onClick={handleSortByPrice} className='btn btn-outline text-[#9538E2] font-semibold border border-[#9538E2] rounded-[32px]'>
                        Sort by Price <PiSliders className='text-lg' />
                    </button>
                    <div>
                        <button
                            onClick={handlePurchaseProduct}
                            className={`btn bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold border-none rounded-[32px] ${isPurchaseOpen ? 'opacity-50 pointer-events-none' : ''}`}
                            disabled={isPurchaseOpen}
                        >
                            Purchase
                        </button>
                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} totalCost={totalCost} />
                    </div>
                </div>
            </div>

            <div className='mt-8 space-y-6  px-4'>
                {
                    cartList.map(cart => (
                        <div key={cart.product_id} className='flex flex-col md:flex-row px-4 py-3 justify-between items-center gap-4 bg-white rounded-2xl'>
                            <div className='md:w-1/4'>
                                {/* Check if the product image exists, otherwise use the default */}
                                                    
                                <img
                                 className='w-40'
                                 src={cart.product_image}
                                 alt={cart.product_title}  
                                />
                            </div>
                            <div className='md:w-4/5 ml-3 space-y-2 md:p-0'>
                                <div className='flex justify-between text-xl font-bold'>
                                    {cart.product_title}
                                    <TiDeleteOutline onClick={() => handleRemoveToCart(cart.product_id)} className='text-red-400 text-3xl mr-16 cursor-pointer' />
                                </div>
                                <p className='text-sm text-[#09080F99]'>{cart.description}</p>
                                <h4 className='font-bold'>{`Price: $${cart.price}`}</h4>
                                <button 
                                    onClick={() => handleAddToCart(cart)} 
                                    className='btn btn-outline text-[#9538E2] font-semibold border border-[#9538E2] rounded-[32px]'
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default DeshCart;
