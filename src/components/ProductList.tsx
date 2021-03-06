import * as React from "react";
import { GetStaticProps } from "next";
import shuffle from "lodash.shuffle";

import { printful } from "../lib/printful-client";
import { formatVariantName } from "../lib/format-variant-name";
import { PrintfulProduct } from "../types";

import ProductGrid from "./ProductGrid";





const ProductList = ({ products }) => (

    <>

        <h1 className="products-headline">
            All Products
            {products}
        </h1>

        <ProductGrid products={products} />


    </>
);

export const getStaticProps = async () => {
    const { result: productIds } = await printful.get("sync/products");

    const allProducts = await Promise.all(
        productIds.map(async ({ id }) => await printful.get(`sync/products/${id}`))
    );

    const products: PrintfulProduct[] = allProducts.map(
        ({ result: { sync_product, sync_variants } }) => ({
            ...sync_product,
            variants: sync_variants.map(({ name, ...variant }) => ({
                name: formatVariantName(name),
                ...variant,
            })),
        })
    );
    console.log("Alle Produkte", allProducts)
    return {
        props: {
            products: shuffle(products),
        },
    };
};

export default ProductList;
