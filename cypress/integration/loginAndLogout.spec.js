describe('several login & logout flows',function(){

    it ('logout users after logging in from login page', () => {
        cy.visit ('/login');
        // Enter username
        cy.get('#username-input') .type('cypress').should('have.value', 'cypress')
        // Enter Pass
        cy.get('#password-input').type('password').should('have.value', 'password')    
        cy.get('#login-form').submit()
        cy.wait(3500)
        // Click on profile dropdown menu
        cy.get('#profile-dropdown-btn').should('exist').click()
        cy.wait(1000)
         // Click logout button
        cy.get('#logout-button').should('exist').click()
        cy.wait(1500)
        // Check logout message
        cy.get('p:contains("Thank you for using WariHash.")').should("exist");
      });
    
    it ('logout users after login through navbar sign in button', () => {
        cy.visit ('/');
        // Click login button on navbar
        cy.get('#login-button').click();
        // Enter username
        cy.wait(3500)
        cy.get('#username-input') .type('cypress').should('have.value', 'cypress')
        // Enter Pass
        cy.get('#password-input').type('password').should('have.value', 'password')
        cy.get('#password-input').type('{enter}')
        cy.wait(3500)
        // Click on profile dropdown menu
        cy.get('#profile-dropdown-btn').should('exist').click()
        cy.wait(1500)
        // Click logout button
        cy.get('#logout-button').should('exist').click()
        cy.wait(1500)
        // Check logout message
        cy.get('p:contains("Thank you for using WariHash.")').should("exist");
      });
    });