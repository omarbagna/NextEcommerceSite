import React, { useState } from 'react';
import {
	AiOutlineMinus,
	AiOutlinePlus,
	AiFillStar,
	AiOutlineStar,
} from 'react-icons/ai';

import { client, urlFor } from '../../lib/client';
import { Product } from '../../components';
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({ productData, similarProductData }) => {
	const { image, name, details, price } = productData;

	const [index, setIndex] = useState(0);
	const { decQty, incQty, qty, onAdd } = useStateContext();

	return (
		<div>
			<div className="product-detail-container">
				<div>
					<div className="image-container">
						<img
							src={urlFor(image && image[index])}
							className="product-detail-image"
						/>
					</div>
					<div className="small-images-container">
						{image?.map((item, i) => (
							<img
								key={i}
								src={urlFor(item)}
								className={
									i === index ? 'small-image selected-image' : 'small-image'
								}
								onMouseEnter={() => setIndex(i)}
							/>
						))}
					</div>
				</div>

				<div className="product-detail-desc">
					<h1>{name}</h1>
					<div className="reviews">
						<div>
							<AiFillStar />
							<AiFillStar />
							<AiFillStar />
							<AiFillStar />
							<AiOutlineStar />
						</div>
						<p>(20)</p>
					</div>
					<h4>Details: </h4>
					<p>{details}</p>
					<p className="price">GH¢{price}</p>
					<div className="quantity">
						<h3>Quantity: </h3>
						<p className="quantity-desc">
							<span className="minus" onClick={decQty}>
								<AiOutlineMinus />
							</span>
							<span className="num" onClick="">
								{qty}
							</span>
							<span className="plus" onClick={incQty}>
								<AiOutlinePlus />
							</span>
						</p>
					</div>
					<div className="buttons">
						<button
							type="button"
							className="add-to-cart"
							onClick={() => onAdd(productData, qty)}>
							Add To Cart
						</button>
						<button type="button" className="buy-now">
							Buy Now
						</button>
					</div>
				</div>
			</div>
			<div className="maylike-products-wrapper">
				<h2>You may also like</h2>
				<div className="marquee">
					<div className="maylike-products-container track">
						{similarProductData.map((item) => (
							<Product product={item} key={item._id} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export const getStaticPaths = async () => {
	const productQuery = `*[_type == "product"] {
        slug {
            current
        }
    }`;

	const productData = await client.fetch(productQuery);

	const paths = productData.map((product) => ({
		params: { slug: product.slug.current },
	}));

	return { paths, fallback: 'blocking' };
};

export const getStaticProps = async ({ params: { slug } }) => {
	const productQuery = `*[_type == "product" && slug.current == '${slug}'][0]`;
	const similarProducts = '*[_type == "product"]';

	const productData = await client.fetch(productQuery);
	const similarProductData = await client.fetch(similarProducts);

	return { props: { productData, similarProductData } };
};

export default ProductDetails;
