
describe("Profile page content test", function() {
    beforeEach(function() {
      cy.login();
      cy.wait(3000);
    });
    
    it("can render profile page", () => {
      cy.visit("/profile")
      cy.wait(2000)
      cy.get('p:contains("Username")').should("exist")
      cy.get('p:contains("Email")').should("exist")
      cy.get('p:contains("Referral Link")').should("exist")  
      cy.get('a:contains("Manage Stratum Settings")').should("exist")  

      cy.get('button:contains("Buy Orders")').should("exist").click({force: true})
      cy.wait(1000)
      cy.get('h5:contains("My Buy Orders")').should("exist")  

      cy.get('button:contains("Sell Orders")').should("exist") .click({force: true})
      cy.wait(1000)
      cy.get('h5:contains("My Sell Orders")').should("exist")  

      cy.get('button:contains("Buy Orders")').should("exist").click({force: true})
      cy.wait(1000)
      cy.get('h5:contains("My Buy Orders")').should("exist")     
     
    });

});