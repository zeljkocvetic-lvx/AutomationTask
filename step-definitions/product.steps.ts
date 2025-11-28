import { Given, When, Then } from '@wdio/cucumber-framework';
import { attachScreenshot } from '../helpers/screenShotHelper.js';
import WorklistPage from '../pages/WorklistPage.js';
import ProductTablePage from '../pages/ProductTablePage.js';
import ProductDetailsPage from '../pages/ProductDetailsPage.js';
import type { Product } from '../interfaces/productInterface.js';
import type { ProductCounts } from '../interfaces/productCounts.js';

// Background
Given('Open the app {string}', async function (url: string) {
    await WorklistPage.open(url);
    await WorklistPage.waitForPageLoaded();
});

// Scenario 1 - Product Info Consistency
When('Select product at index {int} from the worklist', async function (productIndex: number) {
    const worklistProduct = await ProductTablePage.getProductDetails(productIndex);
    this.addProductToStorage(worklistProduct);

    await ProductTablePage.clickProductByIndex(productIndex);
    await ProductDetailsPage.waitForPageLoaded();

    const detailsProduct = await ProductDetailsPage.getProductInfo();
    this.addProductToStorage(detailsProduct);

    await attachScreenshot(`Product Details Page Loaded: ${worklistProduct.name}`);
});

Then('Verify product details page displays matching information for all fields', async function () {
    const products = this.getProducts();
    const formatProduct = (product: Product) => `${product.name}::${product.supplier}::${product.price}::${product.unitsInStock}`;

    const worklistProduct = products.map(formatProduct)[0];
    const detailsProduct = products.map(formatProduct)[1];

    await common.assertion.expectEqual(detailsProduct, worklistProduct);
    await attachScreenshot('Product Info Verified');
});

// Scenario 2 - Product Order Flow
Given('Click on the Shortage tab', async function () {
    await WorklistPage.clickShortageTab();
    await WorklistPage.waitForPageLoaded();
    await attachScreenshot('Shortage Tab Clicked');
});

Given('Select product checkbox at index {int}', async function (productIndex: number) {
    await WorklistPage.selectProductCheckboxByIndex(productIndex);
    await attachScreenshot(`Product Checkbox Selected at index ${productIndex}`);
});

Given('Note the product details at index {int}', async function (productIndex: number) {
    const productInfo = await ProductTablePage.getProductDetails(productIndex);
    this.addProductToStorage(productInfo);
    await attachScreenshot(`Product Noted: ${productInfo.name} with ${productInfo.unitsInStock} units`);
});

When('Click the Order button', async function () {
    await WorklistPage.clickOrderButton();
    await WorklistPage.waitForPageLoaded();
    await attachScreenshot('Order Button Clicked');
});

Then('Click on the Plenty in Stock tab', async function () {
    await WorklistPage.clickPlentyInStockTab();
    await WorklistPage.waitForPageLoaded();
    await attachScreenshot('Plenty in Stock Tab Clicked');
});

Then('Verify the product appears in the list with increased units', async function () {
    const products = this.getProducts();
    const originalProduct = products[0];

    const currentProduct = await ProductTablePage.findProductDetailsByName(originalProduct.name);

    const originalUnits = parseFloat(originalProduct.unitsInStock);
    const currentUnits = parseFloat(currentProduct.unitsInStock);

    await common.assertion.expectTrue(currentUnits > originalUnits);
    await attachScreenshot(`Units increased from ${originalUnits} to ${currentUnits}`);
});

// Scenario 3 - Product Deletion
Given('Note the total products count and {string} category count', async function (category: string) {
    const totalCount = await WorklistPage.getTotalProductsCount();
    const categoryCount = await WorklistPage.getCategoryCount(category);
    const counts: ProductCounts = { total: totalCount, category: categoryCount };
    this.setProductCounts(counts);
    await attachScreenshot(`Initial Counts Noted: Total=${totalCount}, ${category}=${categoryCount}`);
});

Given('Navigate to {string} category tab', async function (category: string) {
    await WorklistPage.clickCategoryTab(category);
    await WorklistPage.waitForPageLoaded();
    await attachScreenshot(`Navigated to ${category} tab`);
});

When('Delete the product at index {int}', async function (productIndex: number) {
    await WorklistPage.selectProductCheckboxByIndex(productIndex);
    await WorklistPage.clickRemoveButtonByIndex(0);
    await WorklistPage.waitForPageLoaded();
    await attachScreenshot(`Product at index ${productIndex} deleted`);
});

Then('Verify the total number of products decreased by 1', async function () {
    const originalCounts = this.getProductCounts();
    const currentTotalCount = await WorklistPage.getTotalProductsCount();
    const expectedTotalCount = originalCounts.total - 1;

    await common.assertion.expectEqual(currentTotalCount, expectedTotalCount);
    await attachScreenshot(`Total products decreased from ${originalCounts.total} to ${currentTotalCount}`);
});

Then('Verify the {string} category count decreased by 1', async function (category: string) {
    const originalCounts = this.getProductCounts();
    const currentCategoryCount = await WorklistPage.getCategoryCount(category);
    const expectedCategoryCount = originalCounts.category - 1;

    await common.assertion.expectEqual(currentCategoryCount, expectedCategoryCount);
    await attachScreenshot(`${category} count decreased from ${originalCounts.category} to ${currentCategoryCount}`);
});

Then('Verify the product is not displayed in any listing', async function () {
    const products = this.getProducts();
    const deletedProduct = products[products.length - 1];

    const isInAllTab = await ProductTablePage.isProductInList(deletedProduct.name);
    await WorklistPage.clickShortageTab();
    await WorklistPage.waitForPageLoaded();
    const isInShortageTab = await ProductTablePage.isProductInList(deletedProduct.name);
    await WorklistPage.clickPlentyInStockTab();
    await WorklistPage.waitForPageLoaded();
    const isInPlentyTab = await ProductTablePage.isProductInList(deletedProduct.name);

    await common.assertion.expectFalse(isInAllTab);
    await common.assertion.expectFalse(isInShortageTab);
    await common.assertion.expectFalse(isInPlentyTab);
    await attachScreenshot(`Product "${deletedProduct.name}" verified as not in any listing`);
});

// Scenario 4 - Product Search
Given('Note the product name at index {int}', async function (productIndex: number) {
    const productInfo = await ProductTablePage.getProductDetails(productIndex);
    this.addProductToStorage(productInfo);
    await attachScreenshot(`Product name noted: ${productInfo.name}`);
});

When('Search for the stored product name', async function () {
    const products = this.getProducts();
    const productToSearch = products[products.length - 1];

    await WorklistPage.searchProduct(productToSearch.name);
    await WorklistPage.waitForPageLoaded();

    await attachScreenshot(`Searched for "${productToSearch.name}"`);
});

Then('Verify only products matching the search query are displayed', async function () {
    const products = this.getProducts();
    const searchTerm = products[products.length - 1].name;

    await ProductTablePage.verifyAllProductsMatchSearchTerm(searchTerm);
    await attachScreenshot(`Verified all products match search term: "${searchTerm}"`);
});

Then('Verify the result count is {int}', async function (expectedCount: number) {
    const actualCount = await ProductTablePage.getVisibleProductCount();
    await common.assertion.expectEqual(actualCount, expectedCount);
    await attachScreenshot(`Result Count Verified: ${actualCount}`);
});
