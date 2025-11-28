import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';
import { BasePage } from './BasePage.js';
import type { Product } from '../interfaces/productInterface.js';

class ProductDetailsPage extends BasePage {
    private static readonly PAGE_TITLE_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Object",
            metadata: "sap.f.DynamicPageTitle",
            id: "*page-pageTitle"
        }
    };

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
            metadata: "sap.m.ObjectAttribute",
            title: "Price"
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
        await ui5.element.getDisplayed(ProductDetailsPage.PAGE_TITLE_SELECTOR);
    }

    async getProductName(): Promise<string> {
        return await ui5.element.getPropertyValue(ProductDetailsPage.PRODUCT_NAME_SELECTOR, "text");
    }

    async getSupplier(): Promise<string> {
        return await ui5.element.getPropertyValue(ProductDetailsPage.SUPPLIER_SELECTOR, "text");
    }

    async getPrice(): Promise<string> {
        const priceText = await ui5.element.getPropertyValue(ProductDetailsPage.PRICE_SELECTOR, "text");
        return priceText.replace(/[^\d.]/g, "");
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
}

export default new ProductDetailsPage();
