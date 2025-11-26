import { setWorldConstructor } from '@wdio/cucumber-framework';
import type { Product } from '../interfaces/productInterface.js';
import type { ProductCounts } from '../interfaces/productCounts.js';

export class CustomWorld {
    private addedProducts: Product[];
    private productCounts: ProductCounts | null;

    constructor() {
        this.addedProducts = [];
        this.productCounts = null;
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

    getProductCounts(): ProductCounts | null {
        return this.productCounts ? { ...this.productCounts } : null;
    }
}

export default CustomWorld;
setWorldConstructor(CustomWorld);
