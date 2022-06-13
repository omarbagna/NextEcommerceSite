import React from 'react';
import { Product, HeroBanner, Footer } from '../components';

const Home = () => {
	return (
		<>
			<HeroBanner />
			<div className="products-heading">
				<h2>Best Selling Products</h2>
				<p>Only the premium products</p>
			</div>
			<div className="products-container">
				{['product 1', 'product 2', 'product 3'].map((product) => product)}
			</div>
			<Footer />
		</>
	);
};

export default Home;
