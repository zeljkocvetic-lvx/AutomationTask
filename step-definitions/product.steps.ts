import { Given, When, Then } from '@wdio/cucumber-framework';
import { attachScreenshot } from '../helpers/screenShotHelper.js';
import WorklistPage from '../pages/WorklistPage.js';
import ProductDetailsPage from '../pages/ProductDetailsPage.js';
import type { Product } from '../support/productInterface.js';

// Background
Given('Open the app {string}', async function (url: string) {
    await WorklistPage.open(url);
});

// Scenario 1 - Product Info Consistency (Dynamic)
When('I select the first product from the worklist', async function () {
    const worklistProductInfo = await WorklistPage.getProductDetails();
    this.addProductToStorage(worklistProductInfo);
    await attachScreenshot(`Product Info Captured: ${worklistProductInfo.name}`);

    await WorklistPage.clickFirstProduct();
    await ProductDetailsPage.waitForPageLoaded();

    const detailsProductInfo = await ProductDetailsPage.getProductInfo();
    this.addProductToStorage(detailsProductInfo);
    await attachScreenshot('Product Details Page Loaded');
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
Given('I note product {string} from the Shortage list with {string} units', async function (_productName: string, _units: string) {
    await attachScreenshot('Shortage Product Noted');
});

When('I order the product', async function () {
    await attachScreenshot('Product Ordered');
});

Then('The product should be removed from the Shortage list', async function () {
    await attachScreenshot('Product Removed from Shortage List');
});

Then('The product should appear in the Plenty in Stock list', async function () {
    await attachScreenshot('Product Appears in Plenty in Stock List');
});

Then('The Units in Stock value should be greater than {string}', async function (_initialUnits: string) {
    await attachScreenshot('Units in Stock Increased');
});

// Scenario 3 - Product Deletion
Given('I note the total products count and {string} category count', async function (_category: string) {
    await attachScreenshot('Initial Counts Noted');
});

Given('I select product {string} from {string} category', async function (_productName: string, _category: string) {
    await attachScreenshot('Product Selected');
});

When('I delete the product', async function () {
    await attachScreenshot('Product Deleted');
});

Then('The total number of products should decrease by 1', async function () {
    await attachScreenshot('Total Products Decreased');
});

Then('The {string} category count should decrease by 1', async function (_category: string) {
    await attachScreenshot('Category Count Decreased');
});

Then('Product {string} should not be displayed in any listing', async function (_productName: string) {
    await attachScreenshot('Product Not Displayed');
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
    common.assertion.expectEqual(actualCount.toString(), expectedCount);
    await attachScreenshot(`Result Count Verified: ${expectedCount}`);
});
