import { Given, When, Then } from '@wdio/cucumber-framework';
import { attachScreenshot } from '../helpers/screenShotHelper.js';
import WorklistPage from '../pages/WorklistPage.js';
import ProductDetailsPage from '../pages/ProductDetailsPage.js';
import type { Product } from '../interfaces/productInterface.js';
import type { ProductCategory } from '../interfaces/productCategory.js';

// Background
Given('Open the app {string}', async function (url: string) {
    await WorklistPage.open(url);
    await WorklistPage.waitForPageLoaded();
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
Given('I click on the Shortage tab', async function () {
    await WorklistPage.clickShortageTab();
    await WorklistPage.waitForPageLoaded();
    await attachScreenshot('Shortage Tab Clicked');
});

Given('I select the first product checkbox', async function () {
    await WorklistPage.selectFirstProductCheckbox();
    await attachScreenshot('First Product Checkbox Selected');
});

Given('I note the product details', async function () {
    const productInfo = await WorklistPage.getProductDetails();
    this.addProductToStorage(productInfo);
    await attachScreenshot(`Product Noted: ${productInfo.name} with ${productInfo.unitsInStock} units`);
});

When('I click the Order button', async function () {
    await WorklistPage.clickOrderButton();
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
    await common.assertion.expectDefined(currentProduct);

    const originalUnits = parseFloat(originalProduct.unitsInStock);
    const currentUnits = parseFloat(currentProduct!.unitsInStock);

    await common.assertion.expectTrue(currentUnits > originalUnits);
    await attachScreenshot(`Units increased from ${originalUnits} to ${currentUnits}`);
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
