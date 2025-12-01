Feature: Product Management in SAP UI5 Worklist Application

    As a QA Automation Engineer
    I want to validate product management functionality
    So that I can ensure the worklist application works correctly

    Background:
        Given Open the app

    @scenario1
    Scenario: Product Info Consistency
        When Open the "All Products" category tab
        And Get "Chai" product details
        When Open product details page for product "Chai"
        Then Verify product details page displays matching information for all fields

    @scenario2
    Scenario: Product Order Flow
        When Open the "Shortage" category tab
        And Get "Northwoods Cranberry Sauce" product details
        When Order product "Northwoods Cranberry Sauce"
        Then Open the "Plenty in Stock" category tab
        And Verify product "Northwoods Cranberry Sauce" appears in the list with increased units

    @scenario3
    Scenario Outline: Product Deletion
        When Open the "<category>" category tab
        Given Note the total products count and "<category>" category count
        And Get "<product_name>" product details
        When Delete product "<product_name>"
        Then Verify the total number of products decreased by <decrease_amount>
        And Verify the "<category>" category count decreased by <decrease_amount>
        And Verify product "<product_name>" is not displayed in any listing

        Examples:
            | category        | product_name               | decrease_amount |
            | Shortage        | Northwoods Cranberry Sauce | 1               |
            | Plenty in Stock | Chang                      | 1               |

    @scenario4
    Scenario: Product Search
        When Open the "All Products" category tab
        And Get "Alice Mutton" product details
        When Search for product "Alice Mutton"
        Then Verify only products matching the search query are displayed
        And Verify the result count is 1
