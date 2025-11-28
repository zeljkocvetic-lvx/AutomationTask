export abstract class BasePage {
    abstract waitForPageLoaded(): Promise<void>;
}