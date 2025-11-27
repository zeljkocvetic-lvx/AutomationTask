import type { ProductCategory } from '../../interfaces/productCategory.js';
import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';

export class CategoryOperations {
    private readonly shortageTabSelector: QmateSelector;
    private readonly plentyInStockTabSelector: QmateSelector;
    private readonly totalProductsTabSelector: QmateSelector;

    constructor(
        shortageTabSelector: QmateSelector,
        plentyInStockTabSelector: QmateSelector,
        totalProductsTabSelector: QmateSelector
    ) {
        this.shortageTabSelector = shortageTabSelector;
        this.plentyInStockTabSelector = plentyInStockTabSelector;
        this.totalProductsTabSelector = totalProductsTabSelector;
    }

    private getCategoryConfig(category: ProductCategory) {
        const configs: Record<ProductCategory, { selector: QmateSelector; clickMethod: () => Promise<void> }> = {
            'Shortage': {
                selector: this.shortageTabSelector,
                clickMethod: () => this.clickShortageTab()
            },
            'Plenty in Stock': {
                selector: this.plentyInStockTabSelector,
                clickMethod: () => this.clickPlentyInStockTab()
            }
        };
        const config = configs[category];
        if (!config) {
            throw new Error(`Unknown category: ${category}`);
        }
        return config;
    }

    async clickShortageTab(): Promise<void> {
        await ui5.userInteraction.click(this.shortageTabSelector);
    }

    async clickPlentyInStockTab(): Promise<void> {
        await ui5.userInteraction.click(this.plentyInStockTabSelector);
    }

    async clickCategoryTab(category: string, waitForPageLoaded: () => Promise<void>): Promise<void> {
        const config = this.getCategoryConfig(category as ProductCategory);
        await config.clickMethod();
        await waitForPageLoaded();
    }

    async getTotalProductsCount(): Promise<number> {
        const countText = await ui5.element.getPropertyValue(this.totalProductsTabSelector, "count");
        return parseInt(countText, 10);
    }

    async getCategoryCount(category: string): Promise<number> {
        const config = this.getCategoryConfig(category as ProductCategory);
        const countText = await ui5.element.getPropertyValue(config.selector, "count");
        return parseInt(countText, 10);
    }
}
