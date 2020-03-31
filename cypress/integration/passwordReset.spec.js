
describe("Send password reset email", function() {
    it('sends password reset link', () => {
        cy.visit('/');
        // Click Nav Signup
        cy.get('#signup-button-nav').click()
        cy.wait(2000)
        // Enter user name
        let randomUserName = 'testReset' + Math.floor(1000 + Math.random() * 9000);
        cy.get('input[name="username"]').type(randomUserName).should('have.value', randomUserName)
        // Enter email
        cy.get('input[name="email"]').type(randomUserName + '@gmail.com').should('have.value', randomUserName + '@gmail.com')
        // Enter password
        cy.get('input[name="password"]').type('1q2w3e4r5t!@#$')
        cy.get('input[name="password2"]').type('1q2w3e4r5t!@#$')
        cy.get('input[type="checkbox"]').check({force: true})
        // Click submit
        cy.get('#signup-button-register').click({force: true})
        // Click success confirmation button
        cy.wait(2500)
        cy.get('button:contains("Confirm")').should('exist')
        
        // visit resend activation link page
        cy.visit('/passwordreset')
        cy.wait(1500)
        // Enter email address
        cy.get('input[name="email"]').type(randomUserName + '@gmail.com').should('have.value', randomUserName + '@gmail.com')
        // Click submit
        cy.get('#password-reset-btn').click({force: true})
        // Click success confirmation
        cy.wait(2500)
        cy.get('button:contains("Confirm")').should('exist')

      });

});