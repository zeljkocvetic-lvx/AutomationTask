Feature: Product Management in SAP UI5 Worklist Application

    As a QA Automation Engineer
    I want to validate product management functionality
    So that I can ensure the worklist application works correctly

    Background:
        Given Open the app "https://sdk.openui5.org/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/mockServer.html?sap-ui-theme=sap_horizon"

    @scenario1
    Scenario Outline: Product Info Consistency
        When I select product at index <product_index> from the worklist
        Then The product details page should display matching information for all fields

        Examples:
            | product_index |
            | 0             |
            | 2             |
            | 1             |

    @scenario2
    Scenario Outline: Product Order Flow
        Given I click on the Shortage tab
        And I select product checkbox at index <product_index>
        And I note the product details at index <product_index>
        When I click the Order button
        Then I click on the Plenty in Stock tab
        And The product should appear in the list with increased units

        Examples:
            | product_index |
            | 0             |
            | 2             |
            | 1             |

    @scenario3
    Scenario Outline: Product Deletion
        Given I note the total products count and "<category>" category count
        And I select product at index <product_index> from "<category>" category
        And I note the product details at index <product_index>
        When I delete the product at index <product_index>
        Then The total number of products should decrease by 1
        And The "<category>" category count should decrease by 1
        And The product should not be displayed in any listing

        Examples:
            | product_index | category |
            | 0             | Shortage |
            | 1             | Shortage |

    @scenario4
    Scenario Outline: Product Search
        Given I note the product name at index <product_index>
        When I search for the stored product name
        Then Only products matching the search query should be displayed
        And The result count should be 1

        Examples:
            | product_index |
            | 0             |
            | 2             |
            | 1             |
