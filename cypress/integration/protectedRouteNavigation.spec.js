// Will break these navigation pages upas they expand.
// Test protected pages navigation
describe("protected pages navigation test", function() {
  beforeEach(function() {
    cy.login();
    cy.wait(1000);
  });

  it("navigates to terms of use page", () => {
    cy.visit("/termsofuse");
    cy.wait(1000);
    cy.get('h5:contains("Terms of Use")').should("exist");
  });

  it("navigates to my profile", () => {
    cy.visit("/profile");
    cy.wait(1500);
    cy.contains("cypress").should("exist");
    cy.contains("test@cypress.com").should("exist");
  });

  it("navigates to stratum page", () => {
    cy.visit("/stratum");
    cy.wait(1000);
    cy.get('h5:contains("Add Stratum Setting")').should("exist");
  });

  it("navigates to marketplace page", () => {
    cy.visit("/");
    cy.wait(1000);
    cy.get('h4:contains("Buy Hashing Power for")').should("exist");
  });

});