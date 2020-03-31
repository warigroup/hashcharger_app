
describe("Change mining algorithm", function() {

    it("can change mining algorithm on marketplace pages", () => {
        // Change mining algorithm on market history page
        cy.visit("/markethistory")
        cy.wait(2000);
        cy.get('h4:contains("Market History for")').should("exist")
        cy.get('#miningalgorithm-selector').click();
        cy.wait(1000);
        cy.get('li:contains("Scrypt")').should("exist").click();
        cy.wait(2500);
        cy.get('button:contains("Scrypt")').should("exist")
        cy.wait(1000);
        // Change mining algorithm on marketplace page.
        cy.visit("/")
        cy.wait(1000);
        cy.get('h4:contains("Marketplace for")').should("exist")
        cy.get('#miningalgorithm-selector').click();
        cy.wait(1000);
        cy.get('li:contains("SHA256d")').should("exist").click();
        cy.wait(2500);
        cy.get('button:contains("SHA256d")').should("exist")
      });
});