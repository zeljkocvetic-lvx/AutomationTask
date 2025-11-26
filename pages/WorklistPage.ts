import type { Product } from '../interfaces/productInterface.js';
import type { ProductCategory } from '../interfaces/productCategory.js';
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

    private static readonly REMOVE_BUTTON_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.Button",
            text: "Remove"
        }
    };

    private static readonly TOTAL_PRODUCTS_TAB_SELECTOR: QmateSelector = {
        elementProperties: {
            viewName: "mycompany.myapp.MyWorklistApp.view.Worklist",
            metadata: "sap.m.IconTabFilter",
            text: [{ path: "i18n>WorklistFilterProductsAll" }]
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

    async clickProductByIndex(index: number): Promise<void> {
        await ui5.userInteraction.click(WorklistPage.PRODUCT_NAME_SELECTOR, index);
    }

    async searchProduct(productName: string): Promise<void> {
        await ui5.userInteraction.searchFor(WorklistPage.SEARCH_FIELD_SELECTOR, productName);
    }

    async getVisibleProductCount(): Promise<number> {
        const products = await ui5.element.getAllDisplayed(WorklistPage.PRODUCT_NAME_SELECTOR);
        return products.length;
    }

    async waitForPageLoaded(): Promise<void> {
        await ui5.element.getDisplayed(WorklistPage.PRODUCT_NAME_SELECTOR);
    }

    async clickShortageTab(): Promise<void> {
        await ui5.userInteraction.click(WorklistPage.SHORTAGE_TAB_SELECTOR);
    }

    async clickPlentyInStockTab(): Promise<void> {
        await ui5.userInteraction.click(WorklistPage.PLENTY_IN_STOCK_TAB_SELECTOR);
    }

    async selectFirstProductCheckbox(): Promise<void> {
        const allCheckboxes = await ui5.element.getAllDisplayed(WorklistPage.PRODUCT_CHECKBOX_SELECTOR);
        this.validateCheckboxesExist(allCheckboxes);
        const firstProductCheckboxIndex = this.calculateCheckboxIndex(0, allCheckboxes.length);
        await ui5.userInteraction.click(WorklistPage.PRODUCT_CHECKBOX_SELECTOR, firstProductCheckboxIndex);
    }

    async selectProductCheckboxByIndex(productIndex: number): Promise<void> {
        const allCheckboxes = await ui5.element.getAllDisplayed(WorklistPage.PRODUCT_CHECKBOX_SELECTOR);
        this.validateCheckboxesExist(allCheckboxes);
        const checkboxIndex = this.calculateCheckboxIndex(productIndex, allCheckboxes.length);
        await ui5.userInteraction.click(WorklistPage.PRODUCT_CHECKBOX_SELECTOR, checkboxIndex);
    }

    async clickOrderButton(): Promise<void> {
        await ui5.userInteraction.click(WorklistPage.ORDER_BUTTON_SELECTOR);
    }

    async getAllProducts(): Promise<Product[]> {
        const products = await ui5.element.getAllDisplayed(WorklistPage.PRODUCT_NAME_SELECTOR);
        const productList: Product[] = [];
        for (let i = 0; i < products.length; i++) {
            const product = await this.getProductDetails(i);
            productList.push(product);
        }
        return productList;
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

    async selectProductCheckboxByName(productName: string): Promise<void> {
        const index = await this.findProductIndexByName(productName);
        this.validateProductIndex(index, productName);
        await this.selectProductCheckboxByIndex(index);
    }

    private validateCheckboxesExist(checkboxes: unknown[]): void {
        if (checkboxes.length === 0) {
            throw new Error('No checkboxes found in the list');
        }
    }

    private calculateCheckboxIndex(productIndex: number, totalCheckboxes: number): number {
        return totalCheckboxes > 1 ? productIndex + 1 : productIndex;
    }

    private validateProductIndex(index: number, productName: string): void {
        if (index === -1) {
            throw new Error(`Product "${productName}" not found in the list`);
        }
    }

    async getTotalProductsCount(): Promise<number> {
        const countText = await ui5.element.getPropertyValue(WorklistPage.TOTAL_PRODUCTS_TAB_SELECTOR, "count");
        return parseInt(countText, 10);
    }

    async getCategoryCount(category: ProductCategory): Promise<number> {
        const config = this.getCategoryConfig(category);
        const countText = await ui5.element.getPropertyValue(config.selector, "count");
        return parseInt(countText, 10);
    }

    async clickCategoryTab(category: ProductCategory): Promise<void> {
        const config = this.getCategoryConfig(category);
        await config.clickMethod();
        await this.waitForPageLoaded();
    }

    async clickRemoveButtonByIndex(index: number): Promise<void> {
        await ui5.userInteraction.click(WorklistPage.REMOVE_BUTTON_SELECTOR, index);
    }

    async isProductInList(productName: string): Promise<boolean> {
        try {
            await this.findProductDetailsByName(productName);
            return true;
        } catch {
            return false;
        }
    }
}

export default new WorklistPage();

