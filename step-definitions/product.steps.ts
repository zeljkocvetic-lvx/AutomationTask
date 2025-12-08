import { Given, When, Then } from '@wdio/cucumber-framework';
import { attachScreenshot } from '../helpers/screenShotHelper.js';
import WorklistPage from '../pages/WorklistPage.js';
import ProductTablePage from '../pages/ProductTablePage.js';
import ProductDetailsPage from '../pages/ProductDetailsPage.js';
import type { Product } from '../interfaces/productInterface.js';
import type { ProductCounts } from '../interfaces/productCounts.js';
import { CategoryDisplayNameMap } from '../types/categoryTab.js';

// Background
Given('Open the app', async function () {
    await WorklistPage.open();
    await WorklistPage.waitForPageLoaded();
});

// Scenario 1 - Product Info Consistency
When('Open the {string} category tab', async function (category: string) {
    const categoryTab = CategoryDisplayNameMap[category];
    await WorklistPage.openCategoryTab(categoryTab);
    await attachScreenshot(`Opened ${category} category tab`);
});

When('Get {string} product details', async function (productName: string) {
    const product = await ProductTablePage.getProductDetails(productName);
    this.addProductToStorage(product);
    //await attachScreenshot(`Got product details for "${productName}"`);
});

When('Open {string} product page', async function (productName: string) {
    await ProductTablePage.clickProduct(productName);
    await ProductDetailsPage.waitForPageLoaded();
    await attachScreenshot(`Opened product page for "${productName}"`);
});

Then('Verify product details page displays matching information for all fields', async function () {
    const detailsProduct = await ProductDetailsPage.getProductInfo();
    const worklistProduct = this.getProductByName(detailsProduct.name);

    const formatProduct = (product: Product) => `${product.name}::${product.supplier}::${product.price}::${product.unitsInStock}`;
    await common.assertion.expectEqual(
        formatProduct(detailsProduct),
        formatProduct(worklistProduct)
    );
});

// // Scenario 2 - Product Order Flow
// Given('Open the {string} category tab', async function (category: string) {
//     const categoryTab = CategoryDisplayNameMap[category];
//     await WorklistPage.openCategoryTab(categoryTab);

//     await attachScreenshot(`Opened ${category} category tab`);
// });

// When('Order the selected product', async function () {
//     const selectedProduct = this.getSelectedProduct();

//     await WorklistPage.selectProductCheckboxByName(selectedProduct.name, (name) => ProductTablePage.findProductIndexByName(name));
//     await WorklistPage.clickOrderButton();
//     await WorklistPage.waitForPageLoaded();

//     await attachScreenshot(`Ordered product "${selectedProduct.name}"`);
// });

// Then('Click the {string} category tab', async function (category: string) {
//     const categoryTab = CategoryDisplayNameMap[category];
//     await WorklistPage.openCategoryTab(categoryTab);

//     await attachScreenshot(`Clicked ${category} category tab`);
// });

// Then('Verify the product appears in the list with increased units', async function () {
//     const originalProduct = this.getSelectedProduct();
//     const currentProduct = await ProductTablePage.findProductDetailsByName(originalProduct.name);
//     const originalUnits = parseFloat(originalProduct.unitsInStock);
//     const currentUnits = parseFloat(currentProduct.unitsInStock);

//     await common.assertion.expectTrue(currentUnits > originalUnits);

//     await attachScreenshot(`Product "${originalProduct.name}" units increased from ${originalUnits} to ${currentUnits}`);
// });

// // Scenario 3 - Product Deletion
// Given('Note the total products count and {string} category count', async function (category: string) {
//     const totalCount = await WorklistPage.getTotalProductsCount();
//     const categoryTab = CategoryDisplayNameMap[category];
//     const categoryCount = await WorklistPage.getCategoryCount(categoryTab);
//     const counts: ProductCounts = { total: totalCount, category: categoryCount };
//     this.setProductCounts(counts);

//     await attachScreenshot(`Initial Counts Noted: Total=${totalCount}, ${category}=${categoryCount}`);
// });

// When('Delete the selected product', async function () {
//     const selectedProduct = this.getSelectedProduct();

//     await WorklistPage.selectProductCheckboxByName(selectedProduct.name, (name) => ProductTablePage.findProductIndexByName(name));
//     await WorklistPage.clickRemoveButtonByIndex(0);
//     await WorklistPage.waitForPageLoaded();

//     await attachScreenshot(`Deleted product "${selectedProduct.name}"`);
// });

// Then('Verify the total number of products decreased by {int}', async function (decreaseAmount: number) {
//     const originalCounts = this.getProductCounts();
//     const currentTotalCount = await WorklistPage.getTotalProductsCount();
//     const expectedTotalCount = originalCounts.total - decreaseAmount;

//     await common.assertion.expectEqual(currentTotalCount, expectedTotalCount);

//     await attachScreenshot(`Total products decreased from ${originalCounts.total} to ${currentTotalCount} (decreased by ${decreaseAmount})`);
// });

// Then('Verify the {string} category count decreased by {int}', async function (category: string, decreaseAmount: number) {
//     const originalCounts = this.getProductCounts();
//     const categoryTab = CategoryDisplayNameMap[category];
//     const currentCategoryCount = await WorklistPage.getCategoryCount(categoryTab);
//     const expectedCategoryCount = originalCounts.category - decreaseAmount;

//     await common.assertion.expectEqual(currentCategoryCount, expectedCategoryCount);

//     await attachScreenshot(`${category} count decreased from ${originalCounts.category} to ${currentCategoryCount} (decreased by ${decreaseAmount})`);
// });

// Then('Verify the product is not displayed in any listing', async function () {
//     const deletedProduct = this.getSelectedProduct();
//     const isInAllTab = await ProductTablePage.isProductInList(deletedProduct.name);

//     await WorklistPage.clickShortageTab();
//     await WorklistPage.waitForPageLoaded();
//     const isInShortageTab = await ProductTablePage.isProductInList(deletedProduct.name);

//     await WorklistPage.clickPlentyInStockTab();
//     await WorklistPage.waitForPageLoaded();
//     const isInPlentyTab = await ProductTablePage.isProductInList(deletedProduct.name);

//     await common.assertion.expectFalse(isInAllTab);
//     await common.assertion.expectFalse(isInShortageTab);
//     await common.assertion.expectFalse(isInPlentyTab);

//     await attachScreenshot(`Product "${deletedProduct.name}" verified as not in any listing`);
// });

// // Scenario 4 - Product Search
// When('Search for the selected product name', async function () {
//     const selectedProduct = this.getSelectedProduct();

//     await WorklistPage.searchProduct(selectedProduct.name);
//     await WorklistPage.waitForPageLoaded();

//     await attachScreenshot(`Searched for "${selectedProduct.name}"`);
// });

// Then('Verify only products matching the search query are displayed', async function () {
//     const selectedProduct = this.getSelectedProduct();

//     await ProductTablePage.verifyAllProductsMatchSearchTerm(selectedProduct.name);

//     await attachScreenshot(`Verified all products match search term: "${selectedProduct.name}"`);
// });

// Then('Verify the result count is {int}', async function (expectedCount: number) {
//     const actualCount = await ProductTablePage.getVisibleProductCount();

//     await common.assertion.expectEqual(actualCount, expectedCount);

//     await attachScreenshot(`Result Count Verified: ${actualCount}`);
// });
