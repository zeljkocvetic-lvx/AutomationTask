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

    private getTableRowSelectorByName(productName: string): QmateSelector {
        return {
            elementProperties: {
                viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
                metadata: "sap.m.ColumnListItem"
            },
            descendantProperties: {
                metadata: "sap.m.ObjectIdentifier",
                viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
                title: productName
            }
        };
    }

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

    async getProductDetails(productName: string): Promise<Product> {
        const productNameElements = await ui5.element.getAllDisplayed(ProductTablePage.PRODUCT_NAME_SELECTOR);
        let rowIndex = -1;

        for (let i = 0; i < productNameElements.length; i++) {
            const name = await ui5.element.getPropertyValue(ProductTablePage.PRODUCT_NAME_SELECTOR, "title", i);
            if (name === productName) {
                rowIndex = i;
                break;
            }
        }

        const name = productName;
        const supplier = await this.getProductSupplier(rowIndex);
        const price = await this.getProductPrice(rowIndex);
        const unitsInStock = await this.getProductUnitsInStock(rowIndex);

        return { name, supplier, price, unitsInStock };
    }

    async clickProduct(productName: string): Promise<void> {
        const productRowSelector = this.getTableRowSelectorByName(productName);
        await ui5.userInteraction.click(productRowSelector);
    }

    async getVisibleProductCount(): Promise<number> {
        const products = await ui5.element.getAllDisplayed(ProductTablePage.PRODUCT_NAME_SELECTOR);
        return products.length;
    }

    async getAllProducts(): Promise<Product[]> {
        const productNameElements = await ui5.element.getAllDisplayed(ProductTablePage.PRODUCT_NAME_SELECTOR);
        const productPromises = [];

        for (let i = 0; i < productNameElements.length; i++) {
            const name = await ui5.element.getPropertyValue(ProductTablePage.PRODUCT_NAME_SELECTOR, "title", i);
            productPromises.push(this.getProductDetails(name));
        }

        return Promise.all(productPromises);
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


