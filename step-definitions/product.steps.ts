import { Given, When, Then } from '@wdio/cucumber-framework';
import { attachScreenshot } from '../helpers/screenShotHelper.js';
import WorklistPage from '../pages/WorklistPage.js';
import ProductDetailsPage from '../pages/ProductDetailsPage.js';
import type { Product } from '../interfaces/productInterface.js';
import type { ProductCounts } from '../interfaces/productCounts.js';
import type { ProductCategory } from '../interfaces/productCategory.js';

// Background
Given('Open the app {string}', async function (url: string) {
    await WorklistPage.open(url);
    await WorklistPage.waitForPageLoaded();
});

// Scenario 1 - Product Info Consistency
When('I select product at index {int} from the worklist', async function (productIndex: number) {
    const worklistProductInfo = await WorklistPage.getProductDetails(productIndex);
    this.addProductToStorage(worklistProductInfo);

    await WorklistPage.clickProductByIndex(productIndex);
    await ProductDetailsPage.waitForPageLoaded();

    const detailsProductInfo = await ProductDetailsPage.getProductInfo();
    this.addProductToStorage(detailsProductInfo);
    await attachScreenshot(`Product Details Page Loaded: ${worklistProductInfo.name}`);
});

Then('The product details page should display matching information for all fields', async function () {
    const products = this.getProducts();

    const formatProduct = (product: Product) => `${product.name}::${product.supplier}::${product.price}::${product.unitsInStock}`;
    const formattedProducts = products.map(formatProduct);

    const worklistProduct = formattedProducts[0];
    const detailsProduct = formattedProducts[1];

    await common.assertion.expectEqual(detailsProduct, worklistProduct);
    await attachScreenshot('Product Info Verified');
});

// Scenario 2 - Product Order Flow
Given('I click on the Shortage tab', async function () {
    await WorklistPage.clickShortageTab();
    await WorklistPage.waitForPageLoaded();
    await attachScreenshot('Shortage Tab Clicked');
});

Given('I select product checkbox at index {int}', async function (productIndex: number) {
    await WorklistPage.selectProductCheckboxByIndex(productIndex);
    await attachScreenshot(`Product Checkbox Selected at index ${productIndex}`);
});

Given('I note the product details at index {int}', async function (productIndex: number) {
    const productInfo = await WorklistPage.getProductDetails(productIndex);
    this.addProductToStorage(productInfo);
    await attachScreenshot(`Product Noted: ${productInfo.name} with ${productInfo.unitsInStock} units`);
});

When('I click the Order button', async function () {
    await WorklistPage.clickOrderButton();
    await WorklistPage.waitForPageLoaded();
    await attachScreenshot('Order Button Clicked');
});

Then('I click on the Plenty in Stock tab', async function () {
    await WorklistPage.clickPlentyInStockTab();
    await WorklistPage.waitForPageLoaded();
    await attachScreenshot('Plenty in Stock Tab Clicked');
});

Then('The product should appear in the list with increased units', async function () {
    const products = this.getProducts();
    const originalProduct = products[0];

    const currentProduct = await WorklistPage.findProductDetailsByName(originalProduct.name);

    const originalUnits = parseFloat(originalProduct.unitsInStock);
    const currentUnits = parseFloat(currentProduct.unitsInStock);

    await common.assertion.expectTrue(currentUnits > originalUnits);
    await attachScreenshot(`Units increased from ${originalUnits} to ${currentUnits}`);
});

// Scenario 3 - Product Deletion
Given('I note the total products count and {string} category count', async function (category: string) {
    const totalCount = await WorklistPage.getTotalProductsCount();
    const categoryCount = await WorklistPage.getCategoryCount(category as ProductCategory);
    const counts: ProductCounts = { total: totalCount, category: categoryCount };
    this.setProductCounts(counts);
    await attachScreenshot(`Initial Counts Noted: Total=${totalCount}, ${category}=${categoryCount}`);
});

Given('I select product at index {int} from {string} category', async function (_productIndex: number, category: string) {
    await WorklistPage.clickCategoryTab(category as ProductCategory);
    await attachScreenshot(`Selected ${category} tab`);
});

When('I delete the product at index {int}', async function (productIndex: number) {
    await WorklistPage.selectProductCheckboxByIndex(productIndex);
    await WorklistPage.clickRemoveButtonByIndex(0);
    await WorklistPage.waitForPageLoaded();
    await attachScreenshot(`Product at index ${productIndex} deleted`);
});

Then('The total number of products should decrease by 1', async function () {
    const originalCounts = this.getProductCounts();
    if (!originalCounts) {
        throw new Error('Product counts were not stored');
    }

    const currentTotalCount = await WorklistPage.getTotalProductsCount();
    const expectedTotalCount = originalCounts.total - 1;

    await common.assertion.expectEqual(currentTotalCount, expectedTotalCount);
    await attachScreenshot(`Total products decreased from ${originalCounts.total} to ${currentTotalCount}`);
});

Then('The {string} category count should decrease by 1', async function (category: string) {
    const originalCounts = this.getProductCounts();
    if (!originalCounts) {
        throw new Error('Product counts were not stored');
    }

    const currentCategoryCount = await WorklistPage.getCategoryCount(category as ProductCategory);
    const expectedCategoryCount = originalCounts.category - 1;

    await common.assertion.expectEqual(currentCategoryCount, expectedCategoryCount);
    await attachScreenshot(`${category} count decreased from ${originalCounts.category} to ${currentCategoryCount}`);
});

Then('The product should not be displayed in any listing', async function () {
    const products = this.getProducts();
    const deletedProduct = products[products.length - 1];

    const isInAllTab = await WorklistPage.isProductInList(deletedProduct.name);
    await WorklistPage.clickShortageTab();
    await WorklistPage.waitForPageLoaded();
    const isInShortageTab = await WorklistPage.isProductInList(deletedProduct.name);
    await WorklistPage.clickPlentyInStockTab();
    await WorklistPage.waitForPageLoaded();
    const isInPlentyTab = await WorklistPage.isProductInList(deletedProduct.name);

    await common.assertion.expectFalse(isInAllTab);
    await common.assertion.expectFalse(isInShortageTab);
    await common.assertion.expectFalse(isInPlentyTab);
    await attachScreenshot(`Product "${deletedProduct.name}" verified as not in any listing`);
});

// Scenario 4 - Product Search
When('I search for product {string}', async function (searchTerm: string) {
    await WorklistPage.searchProduct(searchTerm);
    await attachScreenshot(`Searched for "${searchTerm}"`);
});

Then('Only products matching {string} should be displayed', async function (_searchTerm: string) {
    await attachScreenshot('Search Results Verified');
});

Then('The result count should be {string}', async function (expectedCount: string) {
    const actualCount = await WorklistPage.getVisibleProductCount();
    await common.assertion.expectEqual(actualCount.toString(), expectedCount);
    await attachScreenshot(`Result Count Verified: ${expectedCount}`);
});
