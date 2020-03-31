
describe("Buy hashing power", function() {
    beforeEach(function() {
      cy.login();
      cy.wait(3000);
    });
    
    it("can buy hashing power", () => {
      cy.visit("/")
      cy.wait(2000)
      cy.get('h4:contains("Buy Hashing Power for")').should("exist")
   
      // make sure to have some hashing power available in your SHA256d marketplace before running this test.
      // You can change hashing power input value here. 
      let hashingpower = '250';
      let myduration = '3';
      cy.get('select[name="location"]').select('NA West')
      cy.get('input[name="hashrate"]').type(hashingpower).should('have.value', hashingpower)
      cy.get('input[name="duration"]').type(myduration).should('have.value', myduration)
 
      cy.get('input[name="host"]').type('stratum.slushpool.com', {force: true}).should('have.value', 'stratum.slushpool.com')
      cy.get('input[name="port"]').type('5748', {force: true}).should('have.value', '5748')
      cy.get('input[name="username"]').type('testusername', {force: true}).should('have.value', 'testusername')
      cy.get('input[name="password"]').type('1$@$5w7#Wgr9', {force: true}).should('have.value', '1$@$5w7#Wgr9')
      
      // Submit form
      cy.get('button:contains("Continue to Payment")').click({force: true})
      cy.wait(4000)
      // Confirm we're on invoice page.
      cy.get('#invoice-order-id').should('exist')
    });

});