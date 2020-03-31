describe("Open details modal on market history page", function() {

    // Make sure to have some market history data before running this test. 
    // This will select the first details modal in market history page to see if the modal opens up or not.

    it("can add stratum setting", () => {
        // Navigate to market history page
        cy.visit("/markethistory")
        cy.wait(2000);
        cy.get('h4:contains("Market History for")').should("exist")
        // Open modal
        cy.get('button:contains("Details")').first().click()
        cy.wait(2000);
        // Check modal's contents
        cy.get('span:contains("Settlement ID:")').should("exist")
        cy.get('span:contains("Mining Algorithm:")').should("exist")
        cy.get('span:contains("Mining Start Time:")').should("exist")
        cy.get('span:contains("Mining End Time:")').should("exist")
        cy.get('span:contains("Rate:")').should("exist")
        cy.get('span:contains("Status:")').should("exist")
        cy.get('span:contains("Average Hashrate:")').should("exist")
        // Close modal
        cy.get('#close-modal-btn').click({force: true})

    });

});