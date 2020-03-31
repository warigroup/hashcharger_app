
describe("Add stratum setting on stratum page, then buy hashing power with the saved setting", function() {
    beforeEach(function() {
      cy.login();
      cy.wait(3000);
    });
    
    it("can add stratum setting and buy hashing power with the saved stratum setting", () => {
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


      //// buy hashing power with saved stratum setting ////////////////////////////////
      cy.visit("/")
      cy.wait(1250)
      cy.get('h4:contains("Buy Hashing Power for")').should("exist")
      let hashingpower = '350';
      let myduration = '3';
      cy.get('input[name="hashrate"]').type(hashingpower, {force: true}).should('have.value', hashingpower)
      cy.get('input[name="duration"]').type(myduration, {force: true}).should('have.value', myduration)
 
      //// open up stratum selector //////
      cy.get('#stratum-setting-selector').should('exist').select(`${randomStratumName} [stratum.slushpool.com:3748]`, {force: true})

      cy.wait(1000)

      // Submit form
      cy.get('button:contains("Continue to Payment")').click({force: true})
      cy.wait(4000)
      // Confirm we're on invoice page.
      cy.get('#invoice-order-id').should('exist')
    });

});