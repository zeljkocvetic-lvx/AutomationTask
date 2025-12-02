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


    async findProductIndexByName(productName: string): Promise<number> {
        const productNameElements = await ui5.element.getAllDisplayed(ProductTablePage.PRODUCT_NAME_SELECTOR);

        for (let i = 0; i < productNameElements.length; i++) {

            const name = await ui5.element.getPropertyValue(ProductTablePage.PRODUCT_NAME_SELECTOR, "title", i);

            if (name === productName) {
                return i;
            }
        }
        return -1;
    }

    async findProductDetailsByName(productName: string): Promise<Product> {

        const index = await this.findProductIndexByName(productName);

        if (index === -1) {
            throw new Error(`Product "${productName}" not found in the list`);
        }
        return await this.getProductDetails(index);
    }


    async clickProductByName(productName: string): Promise<void> {

        const index = await this.findProductIndexByName(productName);

        if (index === -1) {
            throw new Error(`Product "${productName}" not found in the list`);
        }
        await this.clickProductByIndex(index);
    }


    async isProductInList(productName: string): Promise<boolean> {
        const index = await this.findProductIndexByName(productName);
        return index !== -1;
    }

    async verifyAllProductsMatchSearchTerm(searchTerm: string): Promise<void> {
        const products = await this.getAllProducts();
        for (const product of products) {
            if (!product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                throw new Error(`Product "${product.name}" does not match search term "${searchTerm}"`);
            }
        }
    }
}

export default new ProductTablePage();

