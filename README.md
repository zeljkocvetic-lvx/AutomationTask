# AutomationTask
Automated test suite for the provided SAP UI5 demo application using TypeScript, QMate, Cucumber, and Allure Report. 


## How to Run Tests

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run all tests:
   ```bash
   npm run wdio
   ```

3. Run specific scenario:
   ```bash
   # Scenario 1: Product Info Consistency
   npm run wdio -- --cucumberOpts.tagExpression '@scenario1'

   # Scenario 2: Product Order Flow
   npm run wdio -- --cucumberOpts.tagExpression '@scenario2'

   # Scenario 3: Product Deletion
   npm run wdio -- --cucumberOpts.tagExpression '@scenario3'

   # Scenario 4: Product Search
   npm run wdio -- --cucumberOpts.tagExpression '@scenario4'
   ```

4. Generate and open Allure report:
   ```bash
   npx allure generate allure-results --clean -o allure-report
   npx allure open allure-report
   ```