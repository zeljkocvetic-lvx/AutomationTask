import { setWorldConstructor } from '@wdio/cucumber-framework';
import type { Product } from '../interfaces/productInterface.js';
import type { ProductCounts } from '../interfaces/productCounts.js';

export class CustomWorld {
    private addedProducts: Product[];
    private productCounts: ProductCounts | null;
    private selectedProduct: Product | null;

    constructor() {
        this.addedProducts = [];
        this.productCounts = null;
        this.selectedProduct = null;
    }

    addProductToStorage(product: Product): void {
        this.addedProducts.push({ ...product });
    }

    getProducts(): Product[] {
        return [...this.addedProducts];
    }

    setProductCounts(counts: ProductCounts): void {
        this.productCounts = { ...counts };
    }

    getProductCounts(): ProductCounts {
        if (!this.productCounts) {
            throw new Error('Product counts not stored. Please note the counts first.');
        }
        return this.productCounts;
    }

    setSelectedProduct(product: Product): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): Product {
        if (!this.selectedProduct) {
            throw new Error('No product selected. Please select a product first.');
        }
        return this.selectedProduct;
    }
}

export default CustomWorld;
setWorldConstructor(CustomWorld);
