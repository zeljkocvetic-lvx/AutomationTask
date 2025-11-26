import type { Product } from '../support/productInterface.js';
import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';
import { BasePage } from './BasePage.js';

class WorklistPage extends BasePage {

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

    private static readonly SEARCH_FIELD_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.SearchField"
        }
    };



    async open(url: string): Promise<void> {
        await common.navigation.navigateToUrl(url);
    }

    async getProductName(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(WorklistPage.PRODUCT_NAME_SELECTOR, "title", index);
    }

    async getProductSupplier(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(WorklistPage.PRODUCT_SUPPLIER_SELECTOR, "text", index);
    }

    async getProductPrice(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(WorklistPage.PRODUCT_PRICE_SELECTOR, "number", index);
    }

    async getProductUnitsInStock(index: number = 0): Promise<string> {
        return await ui5.element.getPropertyValue(WorklistPage.PRODUCT_UNITS_SELECTOR, "number", index);
    }

    async getProductDetails(index: number = 0): Promise<Product> {
        const name = await this.getProductName(index);
        const supplier = await this.getProductSupplier(index);
        const price = await this.getProductPrice(index);
        const unitsInStock = await this.getProductUnitsInStock(index);

        return { name, supplier, price, unitsInStock };
    }

    async clickFirstProduct(): Promise<void> {
        await ui5.userInteraction.click(WorklistPage.PRODUCT_NAME_SELECTOR, 0);
    }

    async searchProduct(productName: string): Promise<void> {
        await ui5.userInteraction.searchFor(WorklistPage.SEARCH_FIELD_SELECTOR, productName);
    }

    async getVisibleProductCount(): Promise<number> {
        const products = await ui5.element.getAllDisplayed(WorklistPage.PRODUCT_NAME_SELECTOR);
        return products.length;
    }

    async waitForPageLoaded(): Promise<void> {
        //await ui5.element.getDisplayed(WorklistPage.COLUMN_TITLE_SELECTOR);
    }
}

export default new WorklistPage();
