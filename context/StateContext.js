import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
	const [showCart, setShowCart] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantity, setTotalQuantity] = useState(0);
	const [qty, setQty] = useState(1);

	let foundProduct;
	let index;

	const onAdd = (product, quantity) => {
		const checkProductInCart = cartItems.find(
			(item) => item._id === product._id
		);

		setTotalPrice(
			(prevTotalPrice) => prevTotalPrice + product.price * quantity
		);
		setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + quantity);

		if (checkProductInCart) {
			const updatedCartItems = cartItems.map((cartProduct) => {
				if (cartProduct._id === product._id)
					return {
						...cartProduct,
						quantity: cartProduct.quantity + quantity,
					};
			});

			setCartItems(updatedCartItems);
		} else {
			product.quantity = quantity;

			setCartItems([...cartItems, { ...product }]);
		}

		toast.success(`${qty} ${product.name} added to cart.`);
	};

	const onRemove = (product) => {
		foundProduct = cartItems.find((item) => item._id === product._id);
		const updatedCartItems = cartItems.filter(
			(item) => item._id !== product._id
		);

		setTotalPrice(
			(prevTotalPrice) =>
				prevTotalPrice - foundProduct.price * foundProduct.quantity
		);
		setTotalQuantity(
			(prevTotalQuantity) => prevTotalQuantity - foundProduct.quantity
		);
		setCartItems(updatedCartItems);
	};

	const toggleCartItemQuantity = (id, value) => {
		foundProduct = cartItems.find((item) => item._id === id);
		index = cartItems.findIndex((product) => product._id === id);

		const updatedCartItems = cartItems.filter((item) => item._id !== id);

		if (value === 'inc') {
			let newCartItems = [
				...updatedCartItems,
				{ ...foundProduct, quantity: foundProduct.quantity + 1 },
			];
			setCartItems(newCartItems);
			setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
			setTotalQuantity((prevTotalQuantity) => prevTotalQuantity + 1);
		} else if (value === 'dec') {
			if (foundProduct.quantity > 1) {
				let newCartItems = [
					...updatedCartItems,
					{ ...foundProduct, quantity: foundProduct.quantity - 1 },
				];
				setCartItems(newCartItems);
				setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
				setTotalQuantity((prevTotalQuantity) => prevTotalQuantity - 1);
			}
		}
	};

	const incQty = () => {
		setQty((prevQty) => prevQty + 1);
	};

	const decQty = () => {
		setQty((prevQty) => {
			if (prevQty - 1 < 1) return 1;

			return prevQty - 1;
		});
	};

	return (
		<Context.Provider
			value={{
				showCart,
				setShowCart,
				cartItems,
				totalPrice,
				totalQuantity,
				qty,
				incQty,
				decQty,
				onAdd,
				toggleCartItemQuantity,
				onRemove,
			}}>
			{children}
		</Context.Provider>
	);
};

export const useStateContext = () => useContext(Context);
