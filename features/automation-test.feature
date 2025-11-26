Feature: Product Management in SAP UI5 Worklist Application

    As a QA Automation Engineer
    I want to validate product management functionality
    So that I can ensure the worklist application works correctly

    Background:
        Given Open the app "https://sdk.openui5.org/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/mockServer.html?sap-ui-theme=sap_horizon"

    @scenario1
    Scenario: Product Info Consistency
        When I select the first product from the worklist
        Then The product details page should display matching information for all fields

    @scenario2
    Scenario: Product Order Flow
        Given I click on the Shortage tab
        And I select the first product checkbox
        And I note the product details
        When I click the Order button
        Then I click on the Plenty in Stock tab
        And The product should appear in the list with increased units

    @scenario3
    Scenario Outline: Product Deletion
        Given I note the total products count and "<category>" category count
        And I select product "<product_name>" from "<category>" category
        When I delete the product
        Then The total number of products should decrease by 1
        And The "<category>" category count should decrease by 1
        And Product "<product_name>" should not be displayed in any listing

        Examples:
            | product_name | category        |
            | Product X    | Plenty in Stock |
            | Product Y    | Shortage        |

    @scenario4
    Scenario Outline: Product Search
        When I search for product "<search_term>"
        Then Only products matching "<search_term>" should be displayed
        And The result count should be "<expected_count>"

        Examples:
            | search_term | expected_count |
            | Product A   | 1              |
            | Widget      | 3              |
