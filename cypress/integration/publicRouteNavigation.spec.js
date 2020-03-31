//Will break these navigation pages upas they expand.
describe("public pages navigation test", function() {

    it("navigates to terms of use page", () => {
      cy.visit("/termsofuse");
      cy.wait(1350);
      cy.get('h5:contains("Terms of Use")').should("exist");
    });
  
    it("navigates to login page", () => {
      cy.visit("/login");
      cy.wait(1350);
      cy.get('h5:contains("Log-in")').should("exist");
    });
  
    it("navigates to registration page without referral code", () => {
      cy.visit("/register");
      cy.wait(1350);
      cy.get('h5:contains("Sign Up")').should("exist");
    });

    it("navigates to registration page with referral code", () => {
      cy.visit("/register/8gf38fu83uf8");
      cy.wait(1350);
      cy.get('h5:contains("Sign Up")').should("exist");
    });
  
    it("navigates to password reset page", () => {
      cy.visit("/passwordreset");
      cy.wait(1350);
      cy.get('h5:contains("Reset your password")').should("exist");
    });
  
    it("navigates to resend page", () => {
      cy.visit("/resend");
      cy.wait(1350);
      cy.get('h5:contains("Resend activation link")').should("exist");
    });

    it("navigates to market history", () => {
      cy.visit("/markethistory")
      cy.wait(1350);
      cy.get('h4:contains("Market History for")').should("exist")
    });

    it("navigates to marketplace without algo parameter", () => {
        // go to root url
        cy.visit("/")
        cy.wait(1350);
        cy.get('h4:contains("Buy Hashing Power for")').should("exist");

        // go to marketplace url
        cy.visit("/marketplace")
        cy.wait(1350);
        cy.get('h4:contains("Buy Hashing Power for")').should("exist");
    });

    it("navigates to marketplace with algo parameter", () => {
      // go to sha256d url
      cy.visit("/marketplace/sha256d")
      cy.wait(1350);
      cy.get('h4:contains("Buy Hashing Power for")').should("exist");
      // go to scrypt url
      cy.visit("/marketplace/scrypt")
      cy.wait(1350);
      cy.get('h4:contains("Buy Hashing Power for")').should("exist");
      // go to ethash url
      cy.visit("/marketplace/ethash")
      cy.wait(1350);
      cy.get('h4:contains("Buy Hashing Power for")').should("exist");

    });

    it("redirects users to a 404 error page when users enter wrong algorithm on marketplace url", () => {
      // go to non-existing url
      cy.visit("/marketplace/daggerhashmoto")
      cy.wait(1500);
      cy.get('h5:contains("ERROR: Page Not Found")').should("exist");

    });

  });