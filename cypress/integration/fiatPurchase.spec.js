
describe("Buy hashing power with fiat", function() {
    beforeEach(function() {
      cy.login();
      cy.wait(3000);
    });
    
    it("can buy hashing power", () => {
      cy.visit("/")
      cy.wait(2000)
      cy.get('h4:contains("Buy Hashing Power for")').should("exist")

      // select USD 
      cy.get('#currency-selector').click();
      cy.wait(1000);
      cy.get('li:contains("USD")').should("exist").click();
      cy.wait(2500);
      cy.get('button:contains("USD")').should("exist")
      cy.wait(1000);
   
      // make sure to have some hashing power available in your SHA256d marketplace before running this test.
      // You can change hashing power input value here. 
      let companyName = 'random_name';
      let email = 'email@email.com';
      let hashingPower = '250';
      let myDuration = '14';
      let phoneNumber = '888-777-8888';
      
      cy.get('input[name="name_or_company"]').type(companyName).should('have.value', companyName)
      cy.get('input[name="email"]').type(email).should('have.value', email)
      cy.get('input[name="phone_number"]').type(phoneNumber).should('have.value', phoneNumber)
      cy.get('input[name="duration_days"]').type(myDuration).should('have.value', myDuration)
      cy.get('input[name="hashrate_fiat"]').type(hashingPower).should('have.value', hashingPower)
      cy.get('select[name="hashrate_units"]').select('KH/s')  
      // Submit form
      cy.get('button:contains("Submit Order")').click({force: true})
      cy.wait(4000)
      // Confirm we're on invoice page.
      cy.get('p:contains("We have received your order!")').should('exist')
    });

});