
describe("Profile page content test", function() {
    beforeEach(function() {
      cy.wait(3000);
    });
    
    it("can render profile page", () => {
      cy.visit("/orderhistory")
      cy.wait(2000)
      cy.get('h4:contains("My Order History")').should("exist");   
      cy.get('#tableT').should('exist')
    });

});