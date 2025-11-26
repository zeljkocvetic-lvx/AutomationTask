import { addAttachment } from '@wdio/allure-reporter';
import { browser } from '@wdio/globals';

export async function attachScreenshot(name = 'Screenshot') {
    const screenshot = await browser.takeScreenshot();
    addAttachment(name, Buffer.from(screenshot, 'base64'), 'image/png');
}