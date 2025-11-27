import { QmateSelector } from 'wdio-qmate-service/modules/ui5/types/ui5.types';

export class ActionOperations {
    private readonly productCheckboxSelector: QmateSelector;
    private readonly orderButtonSelector: QmateSelector;
    private readonly removeButtonSelector: QmateSelector;

    constructor(
        productCheckboxSelector: QmateSelector,
        orderButtonSelector: QmateSelector,
        removeButtonSelector: QmateSelector
    ) {
        this.productCheckboxSelector = productCheckboxSelector;
        this.orderButtonSelector = orderButtonSelector;
        this.removeButtonSelector = removeButtonSelector;
    }

    private validateCheckboxesExist(checkboxes: unknown[]): void {
        if (checkboxes.length === 0) {
            throw new Error('No checkboxes found in the list');
        }
    }

    private calculateCheckboxIndex(productIndex: number, totalCheckboxes: number): number {
        return totalCheckboxes > 1 ? productIndex + 1 : productIndex;
    }

    async selectFirstProductCheckbox(): Promise<void> {
        const allCheckboxes = await ui5.element.getAllDisplayed(this.productCheckboxSelector);
        this.validateCheckboxesExist(allCheckboxes);
        const firstProductCheckboxIndex = this.calculateCheckboxIndex(0, allCheckboxes.length);
        await ui5.userInteraction.click(this.productCheckboxSelector, firstProductCheckboxIndex);
    }

    async selectProductCheckboxByIndex(productIndex: number): Promise<void> {
        const allCheckboxes = await ui5.element.getAllDisplayed(this.productCheckboxSelector);
        this.validateCheckboxesExist(allCheckboxes);
        const checkboxIndex = this.calculateCheckboxIndex(productIndex, allCheckboxes.length);
        await ui5.userInteraction.click(this.productCheckboxSelector, checkboxIndex);
    }

    async selectProductCheckboxByName(
        productName: string,
        findProductIndexByName: (name: string) => Promise<number>,
        validateProductIndex: (index: number, name: string) => void
    ): Promise<void> {
        const index = await findProductIndexByName(productName);
        validateProductIndex(index, productName);
        await this.selectProductCheckboxByIndex(index);
    }

    async clickOrderButton(): Promise<void> {
        await ui5.userInteraction.click(this.orderButtonSelector);
    }

    async clickRemoveButtonByIndex(_index: number): Promise<void> {
        await ui5.element.getDisplayed(this.removeButtonSelector);
        await ui5.userInteraction.click(this.removeButtonSelector);
    }
}


