import type { Product } from '../interfaces/productInterface.js';
import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';

class ProductTablePage {
    // Product table selectors 
    private static readonly PRODUCT_NAME_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.ObjectIdentifier"
        }
    };

    private static readonly PRODUCT_SUPPLIER_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.Text",
            text: [{ path: "Supplier/CompanyName" }]
        }
    };

    private static readonly PRODUCT_PRICE_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.ObjectNumber",
            number: [{ path: "UnitPrice" }]
        }
    };

    private static readonly PRODUCT_UNITS_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.ObjectNumber",
            number: [{ path: "UnitsInStock" }]
        }
    };

    async getProductName(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(ProductTablePage.PRODUCT_NAME_SELECTOR, "title", index);
    }

    async getProductSupplier(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(ProductTablePage.PRODUCT_SUPPLIER_SELECTOR, "text", index);
    }

    async getProductPrice(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(ProductTablePage.PRODUCT_PRICE_SELECTOR, "number", index);
    }

    async getProductUnitsInStock(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(ProductTablePage.PRODUCT_UNITS_SELECTOR, "number", index);
    }

    async getProductDetails(index: number = 0): Promise<Product> {
        const name = await this.getProductName(index);
        const supplier = await this.getProductSupplier(index);
        const price = await this.getProductPrice(index);
        const unitsInStock = await this.getProductUnitsInStock(index);

        return { name, supplier, price, unitsInStock };
    }

    async clickFirstProduct(): Promise<void> {
        await ui5.userInteraction.click(ProductTablePage.PRODUCT_NAME_SELECTOR, 0);
    }

    async clickProductByIndex(index: number): Promise<void> {
        await ui5.userInteraction.click(ProductTablePage.PRODUCT_NAME_SELECTOR, index);
    }

    async getVisibleProductCount(): Promise<number> {
        const products = await ui5.element.getAllDisplayed(ProductTablePage.PRODUCT_NAME_SELECTOR);
        return products.length;
    }

    async getAllProducts(): Promise<Product[]> {
        const products = await ui5.element.getAllDisplayed(ProductTablePage.PRODUCT_NAME_SELECTOR);
        const productPromises = Array.from({ length: products.length }, (_, i) => this.getProductDetails(i));
        return Promise.all(productPromises);
    }

    async getRandomProduct(): Promise<Product> {
        const products = await this.getAllProducts();
        if (products.length === 0) {
            throw new Error('No products found in the current view');
        }
        const randomIndex = Math.floor(Math.random() * products.length);
        return products[randomIndex];
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

export default new ProductTablePage();

