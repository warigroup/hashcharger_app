
describe("Add miners on addminers page", function() {
    beforeEach(function() {
      cy.login();
      cy.wait(3000);
    });
    
    it("can add stratum setting", () => {
      cy.visit("/addminers")
      cy.get('h5:contains("Add Miners")').should("exist")

      let randomMminer = 'testMiners' + Math.floor(1000 + Math.random() * 9000);
      cy.get('input[name="name"]').type(randomMminer).should('have.value',randomMminer)
      cy.get('input[name="declared_hashrate"]').type('45').should('have.value','45')
      cy.get('select[name="hashrate_units"]').select('KH/s')
      cy.get('select[name="location"]').select('NA West')
      // Click submit
      cy.get('#add-miners-btn').click({force: true})
      // Click success confirmation button
      cy.wait(2500)
      cy.get('button:contains("Confirm")').should('exist').click()

    });

});