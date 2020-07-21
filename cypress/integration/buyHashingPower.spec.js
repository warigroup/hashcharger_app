
describe("Buy hashing power", function() {
    beforeEach(function() {
      cy.wait(4000);
    });
    
    it("can buy hashing power", () => {
      cy.visit("/market/stratum.slushpool.com/3333/widgetaccount/password/sha256d/3626a5/ffffff/3626a5/233f5c/ffffff/ffffff/FRxtvCGmNWV9AqJRKAs7CB/subuser")
      cy.wait(2000)
      cy.get('h4:contains("Buy Hashing Power for")').should("exist")
   
      // make sure to have some hashing power available in your SHA256d marketplace before running this test.
      // You can change hashing power input value here. 
      let hashingpower = '250';
      let myduration = '3';
      cy.get('select[name="location"]').select('NA West')
      cy.get('input[name="hashrate"]').type(hashingpower).should('have.value', hashingpower)
      cy.get('input[name="duration"]').type(myduration).should('have.value', myduration)
      // select duration unit
      cy.get('select[name="durationunit"]').select('hour')
 
      // Submit form
      cy.get('button:contains("Continue to Payment")').click({force: true})
      cy.wait(4000)
      // Confirm we're on invoice page.
      cy.get('#invoice-order-id').should('exist')
    });

});