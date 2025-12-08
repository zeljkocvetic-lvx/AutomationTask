import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';
import { BasePage } from './BasePage.js';
import { CategoryTab } from '../types/categoryTab.js';

class WorklistPage extends BasePage {
    private getCategoryTabSelector(category: CategoryTab): QmateSelector {
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
    async openCategoryTab(category: CategoryTab): Promise<void> {
        const selector = this.getCategoryTabSelector(category);
        await ui5.userInteraction.click(selector);
    }

    async getTotalProductsCount(): Promise<number> {
        const selector = this.getCategoryTabSelector(CategoryTab.AllProducts);
        const countText = await ui5.element.getPropertyValue(selector, "count");
        return parseInt(countText, 10);
    }

    async getCategoryCount(category: CategoryTab): Promise<number> {
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

    // Search method
    async searchProduct(productName: string): Promise<void> {
        await ui5.userInteraction.searchFor(WorklistPage.SEARCH_FIELD_SELECTOR, productName);
    }
}

export default new WorklistPage();
