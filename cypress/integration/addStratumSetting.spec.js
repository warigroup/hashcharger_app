
describe("Add stratum setting on stratum page", function() {
    beforeEach(function() {
      cy.login();
      cy.wait(3000);
    });
    
    it("can add stratum setting", () => {
      cy.visit("/stratum")
      cy.wait(2000)
      cy.get('h5:contains("Add Stratum Setting")').should("exist")

      let randomStratumName = 'testStratumTag' + Math.floor(1000 + Math.random() * 9000);
      let randomUsername = 'testUsername' + Math.floor(1000 + Math.random() * 9000);
      let randomPassword = '2T$T$' + Math.floor(1000 + Math.random() * 9000);
      cy.get('input[name="tag"]').type(randomStratumName)
      cy.get('input[name="host"]').type('stratum.slushpool.com')
      cy.get('input[name="port"]').type('3748')
      cy.get('input[name="username"]').type(randomUsername)
      cy.get('input[name="password"]').type(randomPassword)
      // Click submit
      cy.get('#add-stratum-btn').click({force: true})
      // Click success confirmation button
      cy.wait(2500)
      cy.get('button:contains("Confirm")').should('exist').click()

    });

});