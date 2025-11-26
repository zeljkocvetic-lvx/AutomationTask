import { setWorldConstructor } from '@wdio/cucumber-framework';
import type { Product } from './productInterface.js';

export class CustomWorld {
    private addedProducts: Product[];

    constructor() {
        this.addedProducts = [];
    }

    addProductToStorage(product: Product): void {
        this.addedProducts.push({ ...product });
    }

    getProducts(): Product[] {
        return [...this.addedProducts];
    }
}

export default CustomWorld;
setWorldConstructor(CustomWorld);
