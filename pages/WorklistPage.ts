import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';
import { BasePage } from './BasePage.js';

class WorklistPage extends BasePage {
    private static readonly CATEGORY_TO_TEXT_PATH_MAP: Record<string, string> = {
        'Shortage': 'i18n>WorklistFilterShortage',
        'Plenty in Stock': 'i18n>WorklistFilterInStock',
        'All Products': 'i18n>WorklistFilterProductsAll'
    };

    // Common category tab selector builder
    private getCategoryTabSelector(category: string): QmateSelector {
        const i18nPath = WorklistPage.CATEGORY_TO_TEXT_PATH_MAP[category];
        if (!i18nPath) {
            throw new Error(`Unknown category: ${category}`);
        }
        return {
            elementProperties: {
                viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
                metadata: "sap.m.IconTabFilter",
                text: [{ path: i18nPath }]
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

    private static readonly PRODUCT_NAME_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.ObjectIdentifier"
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
    async openCategoryTab(category: string): Promise<void> {
        if (category !== 'All Products') {
            const selector = this.getCategoryTabSelector(category);
            await ui5.userInteraction.click(selector);
            await this.waitForPageLoaded();
        }
    }

    async getTotalProductsCount(): Promise<number> {
        const selector = this.getCategoryTabSelector('All Products');
        const countText = await ui5.element.getPropertyValue(selector, "count");
        return parseInt(countText, 10);
    }

    async getCategoryCount(category: string): Promise<number> {
        const selector = this.getCategoryTabSelector(category);
        const countText = await ui5.element.getPropertyValue(selector, "count");
        return parseInt(countText, 10);
    }

    // Action methods
    async selectProductCheckboxByName(productName: string, findProductIndexByName: (name: string) => Promise<number>): Promise<void> {
        const productIndex = await findProductIndexByName(productName);
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

    // Search method
    async searchProduct(productName: string): Promise<void> {
        await ui5.userInteraction.searchFor(WorklistPage.SEARCH_FIELD_SELECTOR, productName);
    }
}

export default new WorklistPage();
