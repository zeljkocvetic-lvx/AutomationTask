import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';
import { BasePage } from './BasePage.js';
import type { ProductCategory } from '../interfaces/productCategory.js';

class WorklistPage extends BasePage {
    // Category-related selectors
    private static readonly SHORTAGE_TAB_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.IconTabFilter",
            text: [{ path: "i18n>WorklistFilterShortage" }]
        }
    };

    private static readonly PLENTY_IN_STOCK_TAB_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.IconTabFilter",
            text: [{ path: "i18n>WorklistFilterInStock" }]
        }
    };

    private static readonly TOTAL_PRODUCTS_TAB_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.IconTabFilter",
            text: [{ path: "i18n>WorklistFilterProductsAll" }]
        }
    };

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

    // Product name selector - used only for waitForPageLoaded
    private static readonly PRODUCT_NAME_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.ObjectIdentifier"
        }
    };

    // Core page methods
    async open(url: string): Promise<void> {
        await common.navigation.navigateToUrl(url);
    }

    async waitForPageLoaded(): Promise<void> {
        await ui5.element.getDisplayed(WorklistPage.PRODUCT_NAME_SELECTOR);
    }

    // Category methods
    async clickShortageTab(): Promise<void> {
        await ui5.userInteraction.click(WorklistPage.SHORTAGE_TAB_SELECTOR);
    }

    async clickPlentyInStockTab(): Promise<void> {
        await ui5.userInteraction.click(WorklistPage.PLENTY_IN_STOCK_TAB_SELECTOR);
    }

    async clickCategoryTab(category: string): Promise<void> {
        const config = this.getCategoryConfig(category as ProductCategory);
        await config.clickMethod();
        await this.waitForPageLoaded();
    }

    async getTotalProductsCount(): Promise<number> {
        const countText = await ui5.element.getPropertyValue(WorklistPage.TOTAL_PRODUCTS_TAB_SELECTOR, "count");
        return parseInt(countText, 10);
    }

    async getCategoryCount(category: string): Promise<number> {
        if (category === 'All Products') {
            return await this.getTotalProductsCount();
        }
        const config = this.getCategoryConfig(category as ProductCategory);
        const countText = await ui5.element.getPropertyValue(config.selector, "count");
        return parseInt(countText, 10);
    }

    private getCategoryConfig(category: ProductCategory) {
        const configs: Record<ProductCategory, { selector: QmateSelector; clickMethod: () => Promise<void> }> = {
            'Shortage': {
                selector: WorklistPage.SHORTAGE_TAB_SELECTOR,
                clickMethod: () => this.clickShortageTab()
            },
            'Plenty in Stock': {
                selector: WorklistPage.PLENTY_IN_STOCK_TAB_SELECTOR,
                clickMethod: () => this.clickPlentyInStockTab()
            }
        };
        const config = configs[category];
        if (!config) {
            throw new Error(`Unknown category: ${category}`);
        }
        return config;
    }

    // Action methods
    async selectProductCheckboxByIndex(productIndex: number): Promise<void> {
        const allCheckboxes = await ui5.element.getAllDisplayed(WorklistPage.PRODUCT_CHECKBOX_SELECTOR);
        this.validateCheckboxesExist(allCheckboxes);
        const checkboxIndex = this.calculateCheckboxIndex(productIndex, allCheckboxes.length);
        await ui5.userInteraction.click(WorklistPage.PRODUCT_CHECKBOX_SELECTOR, checkboxIndex);
    }

    async selectProductCheckboxByName(productName: string, findProductIndexByName: (name: string) => Promise<number>): Promise<void> {
        const productIndex = await findProductIndexByName(productName);
        if (productIndex === -1) {
            throw new Error(`Product "${productName}" not found in the list`);
        }
        await this.selectProductCheckboxByIndex(productIndex);
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

    // Search method
    async searchProduct(productName: string): Promise<void> {
        await ui5.userInteraction.searchFor(WorklistPage.SEARCH_FIELD_SELECTOR, productName);
    }
}

export default new WorklistPage();
