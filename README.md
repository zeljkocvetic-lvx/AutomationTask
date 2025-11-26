# AutomationTask
Automated test suite for the provided SAP UI5 demo application using TypeScript, QMate, Cucumber, and Allure Report. 


## How to Run Tests

1. Install dependencies:
   ```bash
   npm install

2. Run Tests:
   npx wdio run wdio.conf.ts
   npx allure generate allure-results --clean -o allure-report
   npx allure open allure-report