
describe("Sell hashing power", function() {
    beforeEach(function() {
      cy.login();
      cy.wait(3000);
    });
    
    it("can sell hashing power", () => {
      // Add test miners first.
      cy.visit("/addminers")
      cy.get('h5:contains("Add Miners")').should("exist")

      let randomMminer = 'testSellPage' + Math.floor(1000 + Math.random() * 9000);
      cy.get('input[name="name"]').type(randomMminer).should('have.value',randomMminer)
      cy.get('input[name="declared_hashrate"]').type('45').should('have.value','45')
      cy.get('select[name="hashrate_units"]').select('KH/s')
      cy.get('select[name="location"]').select('NA West')
      // Click submit
      cy.get('#add-miners-btn').click({force: true})
      // Click success confirmation button
      cy.wait(2500)
      cy.get('button:contains("Confirm")').should('exist').click()
      cy.wait(3000)

      // Visit sell page
      cy.get('a:contains("Back to Sell Hashing Power")').should('exist').click()
      cy.wait(3000)
      cy.get('h4:contains("Sell Hashing Power for")').should("exist")  
      // Fill out sell form
      cy.get('select[name="miner_id"]').select(randomMminer, {force: true})
      cy.get('input[name="price"]').type('0.00015', {force: true}).should('have.value', '0.00015')
      cy.get('input[name="payment_address"]').type('1BoatSLRHtKNngkdXEeobR76b53LETtpyT', {force: true}).should('have.value', '1BoatSLRHtKNngkdXEeobR76b53LETtpyT')
      cy.get('input[name="host"]').type('stratum.slushpool.com', {force: true}).should('have.value', 'stratum.slushpool.com')
      cy.get('input[name="port"]').type('5748', {force: true}).should('have.value', '5748')
      cy.get('input[name="username"]').type('testusername', {force: true}).should('have.value', 'testusername')
      cy.get('input[name="password"]').type('1$@$5w7#Wgr9', {force: true}).should('have.value', '1$@$5w7#Wgr9')
      
      // Submit form
      cy.get('button:contains("Submit")').click()
      cy.wait(2500)
      cy.get('button:contains("Confirm")').should('exist').click()

    });

});