Feature: Product Management in SAP UI5 Worklist Application

    As a QA Automation Engineer
    I want to validate product management functionality
    So that I can ensure the worklist application works correctly

    Background:
        Given Open the app "https://sdk.openui5.org/test-resources/sap/m/demokit/tutorial/worklist/07/webapp/test/mockServer.html?sap-ui-theme=sap_horizon"

    @scenario1
    Scenario Outline: Product Info Consistency
        When Select product at index <product_index> from the worklist
        Then Verify product details page displays matching information for all fields

        Examples:
            | product_index |
            | 0             |
            | 2             |
            | 1             |

    @scenario2
    Scenario Outline: Product Order Flow
        Given Click on the Shortage tab
        And Select product checkbox at index <product_index>
        And Note the product details at index <product_index>
        When Click the Order button
        Then Click on the Plenty in Stock tab
        And Verify the product appears in the list with increased units

        Examples:
            | product_index |
            | 0             |
            | 2             |
            | 1             |

    @scenario3
    Scenario Outline: Product Deletion
        Given Note the total products count and <category> category count
        And Select product at index <product_index> from <category> category
        And Note the product details at index <product_index>
        When Delete the product at index <product_index>
        Then Verify the total number of products decreased by 1
        And Verify the <category> category count decreased by 1
        And Verify the product is not displayed in any listing

        Examples:
            | product_index | category |
            | 0             | Shortage |
            | 1             | Shortage |

    @scenario4
    Scenario Outline: Product Search
        Given Note the product name at index <product_index>
        When Search for the stored product name
        Then Verify only products matching the search query are displayed
        And Verify the result count is 1

        Examples:
            | product_index |
            | 0             |
            | 2             |
            | 1             |
