import type { Product } from '../interfaces/productInterface.js';
import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';
import { BasePage } from './BasePage.js';
import { ProductOperations } from './operations/ProductOperations.js';
import { CategoryOperations } from './operations/CategoryOperations.js';
import { ActionOperations } from './operations/ActionOperations.js';

class WorklistPage extends BasePage {
    // Product-related selectors
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
            metadata: "sap.m.SearchField",
            id: "*searchField"
        }
    };

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

    private readonly productOperations: ProductOperations;
    private readonly categoryOperations: CategoryOperations;
    private readonly actionOperations: ActionOperations;

    constructor() {
        super();
        this.productOperations = new ProductOperations(
            WorklistPage.PRODUCT_NAME_SELECTOR,
            WorklistPage.PRODUCT_SUPPLIER_SELECTOR,
            WorklistPage.PRODUCT_PRICE_SELECTOR,
            WorklistPage.PRODUCT_UNITS_SELECTOR,
            WorklistPage.SEARCH_FIELD_SELECTOR
        );
        this.categoryOperations = new CategoryOperations(
            WorklistPage.SHORTAGE_TAB_SELECTOR,
            WorklistPage.PLENTY_IN_STOCK_TAB_SELECTOR,
            WorklistPage.TOTAL_PRODUCTS_TAB_SELECTOR
        );
        this.actionOperations = new ActionOperations(
            WorklistPage.PRODUCT_CHECKBOX_SELECTOR,
            WorklistPage.ORDER_BUTTON_SELECTOR,
            WorklistPage.REMOVE_BUTTON_SELECTOR
        );
    }

    // Core page methods
    async open(url: string): Promise<void> {
        await common.navigation.navigateToUrl(url);
    }

    async waitForPageLoaded(): Promise<void> {
        await ui5.element.getDisplayed(WorklistPage.PRODUCT_NAME_SELECTOR);
    }

    // Product Operations - Delegated
    async getProductName(index: number = 0): Promise<string> {
        return this.productOperations.getProductName(index);
    }

    async getProductSupplier(index: number = 0): Promise<string> {
        return this.productOperations.getProductSupplier(index);
    }

    async getProductPrice(index: number = 0): Promise<string> {
        return this.productOperations.getProductPrice(index);
    }

    async getProductUnitsInStock(index: number = 0): Promise<string> {
        return this.productOperations.getProductUnitsInStock(index);
    }

    async getProductDetails(index: number = 0): Promise<Product> {
        return this.productOperations.getProductDetails(index);
    }

    async clickFirstProduct(): Promise<void> {
        return this.productOperations.clickFirstProduct();
    }

    async clickProductByIndex(index: number): Promise<void> {
        return this.productOperations.clickProductByIndex(index);
    }

    async clickProductByName(productName: string): Promise<void> {
        return this.productOperations.clickProductByName(productName);
    }

    async searchProduct(productName: string): Promise<void> {
        return this.productOperations.searchProduct(productName);
    }

    async getVisibleProductCount(): Promise<number> {
        return this.productOperations.getVisibleProductCount();
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productOperations.getAllProducts();
    }

    async findProductDetailsByName(productName: string): Promise<Product> {
        return this.productOperations.findProductDetailsByName(productName);
    }

    async findProductIndexByName(productName: string): Promise<number> {
        return this.productOperations.findProductIndexByName(productName);
    }

    async isProductInList(productName: string): Promise<boolean> {
        return this.productOperations.isProductInList(productName);
    }

    async verifyAllProductsMatchSearchTerm(searchTerm: string): Promise<void> {
        return this.productOperations.verifyAllProductsMatchSearchTerm(searchTerm);
    }

    // Category Operations - Delegated
    async clickShortageTab(): Promise<void> {
        return this.categoryOperations.clickShortageTab();
    }

    async clickPlentyInStockTab(): Promise<void> {
        return this.categoryOperations.clickPlentyInStockTab();
    }

    async clickCategoryTab(category: string): Promise<void> {
        return this.categoryOperations.clickCategoryTab(category, () => this.waitForPageLoaded());
    }

    async getTotalProductsCount(): Promise<number> {
        return this.categoryOperations.getTotalProductsCount();
    }

    async getCategoryCount(category: string): Promise<number> {
        return this.categoryOperations.getCategoryCount(category);
    }

    // Action Operations - Delegated
    async selectFirstProductCheckbox(): Promise<void> {
        return this.actionOperations.selectFirstProductCheckbox();
    }

    async selectProductCheckboxByIndex(productIndex: number): Promise<void> {
        return this.actionOperations.selectProductCheckboxByIndex(productIndex);
    }

    async selectProductCheckboxByName(productName: string): Promise<void> {
        return this.actionOperations.selectProductCheckboxByName(
            productName,
            (name) => this.findProductIndexByName(name),
            (index, name) => {
                if (index === -1) {
                    throw new Error(`Product "${name}" not found in the list`);
                }
            }
        );
    }

    async clickOrderButton(): Promise<void> {
        return this.actionOperations.clickOrderButton();
    }

    async clickRemoveButtonByIndex(index: number): Promise<void> {
        return this.actionOperations.clickRemoveButtonByIndex(index);
    }
}

export default new WorklistPage();
