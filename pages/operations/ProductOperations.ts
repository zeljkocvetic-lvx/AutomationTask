import type { Product } from '../../interfaces/productInterface.js';
import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';

export class ProductOperations {
    private readonly productNameSelector: QmateSelector;
    private readonly productSupplierSelector: QmateSelector;
    private readonly productPriceSelector: QmateSelector;
    private readonly productUnitsSelector: QmateSelector;
    private readonly searchFieldSelector: QmateSelector;

    constructor(
        productNameSelector: QmateSelector,
        productSupplierSelector: QmateSelector,
        productPriceSelector: QmateSelector,
        productUnitsSelector: QmateSelector,
        searchFieldSelector: QmateSelector
    ) {
        this.productNameSelector = productNameSelector;
        this.productSupplierSelector = productSupplierSelector;
        this.productPriceSelector = productPriceSelector;
        this.productUnitsSelector = productUnitsSelector;
        this.searchFieldSelector = searchFieldSelector;
    }

    async getProductName(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(this.productNameSelector, "title", index);
    }

    async getProductSupplier(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(this.productSupplierSelector, "text", index);
    }

    async getProductPrice(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(this.productPriceSelector, "number", index);
    }

    async getProductUnitsInStock(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(this.productUnitsSelector, "number", index);
    }

    async getProductDetails(index: number = 0): Promise<Product> {
        const name = await this.getProductName(index);
        const supplier = await this.getProductSupplier(index);
        const price = await this.getProductPrice(index);
        const unitsInStock = await this.getProductUnitsInStock(index);

        return { name, supplier, price, unitsInStock };
    }

    async clickFirstProduct(): Promise<void> {
        await ui5.userInteraction.click(this.productNameSelector, 0);
    }

    async clickProductByIndex(index: number): Promise<void> {
        await ui5.userInteraction.click(this.productNameSelector, index);
    }

    async searchProduct(productName: string): Promise<void> {
        await ui5.userInteraction.searchFor(this.searchFieldSelector, productName);
    }

    async getVisibleProductCount(): Promise<number> {
        const products = await ui5.element.getAllDisplayed(this.productNameSelector);
        return products.length;
    }

    async getAllProducts(): Promise<Product[]> {
        const products = await ui5.element.getAllDisplayed(this.productNameSelector);
        const productList: Product[] = [];
        for (let i = 0; i < products.length; i++) {
            const product = await this.getProductDetails(i);
            productList.push(product);
        }
        return productList;
    }

    async findProductDetailsByName(productName: string): Promise<Product> {
        const products = await this.getAllProducts();
        const product = products.find(product => product.name === productName);
        if (!product) {
            throw new Error(`Product "${productName}" not found in the list`);
        }
        return product;
    }

    async findProductIndexByName(productName: string): Promise<number> {
        const products = await this.getAllProducts();
        const index = products.findIndex(product => product.name === productName);
        return index;
    }

    async clickProductByName(productName: string): Promise<void> {
        const index = await this.findProductIndexByName(productName);
        this.validateProductIndex(index, productName);
        await this.clickProductByIndex(index);
    }

    async isProductInList(productName: string): Promise<boolean> {
        try {
            await this.findProductDetailsByName(productName);
            return true;
        } catch {
            return false;
        }
    }

    async verifyAllProductsMatchSearchTerm(searchTerm: string): Promise<void> {
        const products = await this.getAllProducts();
        for (const product of products) {
            if (!product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                throw new Error(`Product "${product.name}" does not match search term "${searchTerm}"`);
            }
        }
    }

    private validateProductIndex(index: number, productName: string): void {
        if (index === -1) {
            throw new Error(`Product "${productName}" not found in the list`);
        }
    }
}


