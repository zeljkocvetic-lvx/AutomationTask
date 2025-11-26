import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';
import { BasePage } from './BasePage.js';
import type { Product } from '../support/productInterface.js';

class ProductDetailsPage extends BasePage {

    private static readonly PRODUCT_NAME_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Object",
            metadata: "sap.m.Title"
        }
    };

    private static readonly SUPPLIER_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Object",
            metadata: "sap.m.Text",
            text: [{ path: "Supplier/CompanyName" }]
        }
    };

    private static readonly PRICE_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Object",
            metadata: "sap.m.Text"
        },
        ancestorProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Object",
            metadata: "sap.m.Panel",
            headerText: [{ path: "i18n>ObjectPricingTabTitle" }]
        }
    };

    private static readonly UNITS_IN_STOCK_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Object",
            metadata: "sap.m.ObjectNumber",
            id: "*objectHeader"
        }
    };

    async waitForPageLoaded(): Promise<void> {
        await ui5.element.getDisplayed(ProductDetailsPage.PRODUCT_NAME_SELECTOR);
    }

    async getProductName(): Promise<string> {
        return await ui5.element.getPropertyValue(ProductDetailsPage.PRODUCT_NAME_SELECTOR, "text");
    }

    async getSupplier(): Promise<string> {
        return await ui5.element.getPropertyValue(ProductDetailsPage.SUPPLIER_SELECTOR, "text");
    }

    async getPrice(): Promise<string> {
        const element = await ui5.element.getDisplayed(ProductDetailsPage.PRICE_SELECTOR);
        const text = await element.getText();
        const match = text.match(/[\d.]+/);
        return match ? match[0] : text;
    }

    async getUnitsInStock(): Promise<string> {
        const value = await ui5.element.getPropertyValue(ProductDetailsPage.UNITS_IN_STOCK_SELECTOR, "number");
        return value.toString();
    }

    async getProductInfo(): Promise<Product> {
        const name = await this.getProductName();
        const supplier = await this.getSupplier();
        const price = await this.getPrice();
        const unitsInStock = await this.getUnitsInStock();

        return { name, supplier, price, unitsInStock };
    }

    async goBack(): Promise<void> {
        await common.userInteraction.pressKey("Escape");
    }
}

export default new ProductDetailsPage();
