//Will break these navigation pages upas they expand.
describe("public pages navigation test", function() {

    it("navigates to marketplace page", () => {
      cy.visit("/market/stratum.slushpool.com/3333/widgetaccount/password/sha256d/3626a5/ffffff/3626a5/233f5c/ffffff/ffffff/FRxtvCGmNWV9AqJRKAs7CB/subuser");
      cy.wait(1350);
      cy.get('h4:contains("Buy Hashing Power for")').should("exist")
    });
  
    it("navigates order history page", () => {
      cy.visit("/orderhistory");
      cy.wait(1350);
      cy.get('h4:contains("My Order History")').should("exist");
    });
  
    it("navigates to marketplace page", () => {
      cy.visit("/market/stratum.slushpool.com/3333/widgetaccount/password/sha256d/3626a5/ffffff/3626a5/233f5c/ffffff/ffffff/FRxtvCGmNWV9AqJRKAs7CB/subuser");
      cy.wait(1350);
      cy.get('h4:contains("Buy Hashing Power for")').should("exist")
    });

  });