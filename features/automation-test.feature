Feature: Product Management in SAP UI5 Worklist Application

    As a QA Automation Engineer
    I want to validate product management functionality
    So that I can ensure the worklist application works correctly

    Background:
        Given Open the app

    @scenario1
    Scenario: Product Info Consistency
        Given Open the "All Products" category tab
        Given Select product "Chai" from "All Products" category
        When Open product details page for product "Chai"
        Then Verify product details page displays matching information for all fields

    @scenario2
    Scenario: Product Order Flow
        Given Open the "Shortage" category tab
        Given Select product "Northwoods Cranberry Sauce" from "Shortage" category
        When Order product "Northwoods Cranberry Sauce"
        Then Open the "Plenty in Stock" category tab
        And Verify product "Northwoods Cranberry Sauce" appears in the list with increased units

    @scenario3
    Scenario Outline: Product Deletion
        Given Open the "<category>" category tab
        Given Note the total products count and "<category>" category count
        Given Select product "<product_name>" from "<category>" category
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
        Given Open the "All Products" category tab
        Given Select product "Alice Mutton" from "All Products" category
        When Search for product "Alice Mutton"
        Then Verify only products matching the search query are displayed
        And Verify the result count is 1
