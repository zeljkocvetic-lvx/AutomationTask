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
        And Open "Chai" product page
        Then Verify product details page displays matching information for all fields

    @scenario2
    Scenario: Product Order Flow
        When Open the "Shortage" category tab
        And Order product "Northwoods Cranberry Sauce"
        And Open the "Plenty in Stock" category tab
        Then Verify product "Northwoods Cranberry Sauce" appears in the list with increased units

    @scenario3
    Scenario Outline: Product Deletion
        When Open the "<category>" category tab
        Given Get the total products count
        And Get the "<category>" category count
        And Delete product "<product_name>"
        Then Verify the total number of products decreased by "<decrease_amount>"
        And Verify the "<category>" category count decreased by "<decrease_amount>"
        And Verify product "<product_name>" is not displayed in "<category>" listing

        Examples:
            | category        | product_name               | decrease_amount |
            | Shortage        | Northwoods Cranberry Sauce | 1               |
            | Plenty in Stock | Chang                      | 1               |

    @scenario4
    Scenario: Product Search
        When Open the "All Products" category tab
        And Search for product "Alice Mutton"
        Then Verify only products matching the search query are displayed

