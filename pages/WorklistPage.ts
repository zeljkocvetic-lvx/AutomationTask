import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';
import { BasePage } from './BasePage.js';
import { CategoryTabEnum } from '../enums/CategoryTabEnum.js';
import type { Product } from '../interfaces/productInterface.js';

class WorklistPage extends BasePage {
    private getCategoryTabSelector(category: CategoryTabEnum): QmateSelector {
        return {
            elementProperties: {
                viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
                metadata: "sap.m.IconTabFilter",
                text: [{ path: category }]
            }
        };
    }

    // Action-related selectors
    private static readonly PRODUCT_CHECKBOX_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.CheckBox"
        }
    };

    private static readonly ORDER_BUTTON_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.Button",
            text: "Order"
        }
    };

    private static readonly REMOVE_BUTTON_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.Button",
            text: "Remove"
        }
    };

    // Search field selector
    private static readonly SEARCH_FIELD_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.SearchField",
            id: "*searchField"
        }
    };

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

    // Core page methods
    async open(): Promise<void> {
        const url = 'https://sdk.openui5.org/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/mockServer.html?sap-ui-theme=sap_horizon';
        await common.navigation.navigateToUrl(url);
    }

    async waitForPageLoaded(): Promise<void> {
        await ui5.element.getDisplayed(WorklistPage.PRODUCT_NAME_SELECTOR);
    }

    // Category methods
    async openCategoryTab(category: CategoryTabEnum): Promise<void> {
        const selector = this.getCategoryTabSelector(category);
        await ui5.userInteraction.click(selector);
    }

    async getTotalProductsCount(): Promise<number> {
        const selector = this.getCategoryTabSelector(CategoryTabEnum.AllProducts);
        const countText = await ui5.element.getPropertyValue(selector, "count");
        return parseInt(countText, 10);
    }

    async getCategoryCount(category: CategoryTabEnum): Promise<number> {
        const selector = this.getCategoryTabSelector(category);
        const countText = await ui5.element.getPropertyValue(selector, "count");
        return parseInt(countText, 10);
    }

    // Action methods
    async selectProductCheckboxByName(productName: string, findProductPosition: (name: string) => Promise<number>): Promise<void> {
        const productIndex = await findProductPosition(productName);
        if (productIndex === -1) {
            throw new Error(`Product "${productName}" not found in the list`);
        }

        const allCheckboxes = await ui5.element.getAllDisplayed(WorklistPage.PRODUCT_CHECKBOX_SELECTOR);
        this.validateCheckboxesExist(allCheckboxes);
        const checkboxIndex = this.calculateCheckboxIndex(productIndex, allCheckboxes.length);
        await ui5.userInteraction.click(WorklistPage.PRODUCT_CHECKBOX_SELECTOR, checkboxIndex);
    }

    async clickOrderButton(): Promise<void> {
        await ui5.userInteraction.click(WorklistPage.ORDER_BUTTON_SELECTOR);
    }

    async clickRemoveButtonByIndex(_index: number): Promise<void> {
        await ui5.element.getDisplayed(WorklistPage.REMOVE_BUTTON_SELECTOR);
        await ui5.userInteraction.click(WorklistPage.REMOVE_BUTTON_SELECTOR);
    }

    private validateCheckboxesExist(checkboxes: unknown[]): void {
        if (checkboxes.length === 0) {
            throw new Error('No checkboxes found in the list');
        }
    }

    private calculateCheckboxIndex(productIndex: number, totalCheckboxes: number): number {
        return totalCheckboxes > 1 ? productIndex + 1 : productIndex;
    }

    // Product methods
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

    async getProductDetails(productName: string): Promise<Product> {
        const rowSelector = this.getTableRowSelectorByName(productName);
        await ui5.element.getDisplayed(rowSelector);

        const supplierSelector: QmateSelector = {
            elementProperties: (WorklistPage.PRODUCT_SUPPLIER_SELECTOR as any).elementProperties,
            ancestorProperties: {
                ...(rowSelector as any).elementProperties,
                descendantProperties: (rowSelector as any).descendantProperties
            }
        } as QmateSelector;

        const priceSelector: QmateSelector = {
            elementProperties: (WorklistPage.PRODUCT_PRICE_SELECTOR as any).elementProperties,
            ancestorProperties: {
                ...(rowSelector as any).elementProperties,
                descendantProperties: (rowSelector as any).descendantProperties
            }
        } as QmateSelector;

        const unitsSelector: QmateSelector = {
            elementProperties: (WorklistPage.PRODUCT_UNITS_SELECTOR as any).elementProperties,
            ancestorProperties: {
                ...(rowSelector as any).elementProperties,
                descendantProperties: (rowSelector as any).descendantProperties
            }
        } as QmateSelector;

        const supplier = await ui5.element.getPropertyValue(supplierSelector, "text", 0);
        const price = await ui5.element.getPropertyValue(priceSelector, "number", 0);
        const unitsInStock = await ui5.element.getPropertyValue(unitsSelector, "number", 0);

        return { name: productName, supplier, price, unitsInStock };
    }

    async clickProduct(productName: string): Promise<void> {
        const productRowSelector = this.getTableRowSelectorByName(productName);
        await ui5.userInteraction.click(productRowSelector);
    }

    async getVisibleProductCount(): Promise<number> {
        const products = await ui5.element.getAllDisplayed(WorklistPage.PRODUCT_NAME_SELECTOR);
        return products.length;
    }

    async getAllProducts(): Promise<Product[]> {
        const productNameElements = await ui5.element.getAllDisplayed(WorklistPage.PRODUCT_NAME_SELECTOR);
        const productPromises = [];

        for (let i = 0; i < productNameElements.length; i++) {
            const name = await ui5.element.getPropertyValue(WorklistPage.PRODUCT_NAME_SELECTOR, "title", i);
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

    // Search method
    async searchProduct(productName: string): Promise<void> {
        await ui5.userInteraction.searchFor(WorklistPage.SEARCH_FIELD_SELECTOR, productName);
    }
}

export default new WorklistPage();
