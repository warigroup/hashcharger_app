describe('registering as a new user', function () {

  it('will show correct error messages', () => {
    cy.visit('/');
    // Click Nav Signup
    cy.get('#signup-button-nav').click()
    cy.wait(2000)
    // Enter user name
    let randomUserName = 'testUser' + Math.floor(1000 + Math.random() * 9000);
    cy.get('input[name="username"]').type(randomUserName).should('have.value', randomUserName)
    // Enter email
    cy.get('input[name="email"]').type(randomUserName + '@gmail.com').should('have.value', randomUserName + '@gmail.com')
    // Enter password
    // Test password length error message
    cy.get('input[name="password"]').type('1')
    cy.get('input[name="password2"]').type('1')
    cy.wait(1000)
    cy.get('p:contains("Your password must be at least 9 characters long.")').should('exist')
    cy.wait(1000)
    // Test alphanumeric error message
    cy.get('input[name="password"]').type('123123123')
    cy.get('input[name="password2"]').type('123123123')
    cy.wait(1000)
    cy.get('p:contains("Your password must contain at least one character that is not a number.")').should('exist')
    cy.wait(1000)
    // Test agreement checkbox error message
    // Click submit
    cy.get('#signup-button-register').click({force: true})
    cy.wait(1500)
    cy.get('p:contains("Please agree to our terms of use.")').should('exist')
  });

  it('will sign up through nav bar link', () => {
    cy.visit('/');
    // Click Nav Signup
    cy.get('#signup-button-nav').click()
    cy.wait(1500)
    // Enter user name
    let randomUserName = 'testUser' + Math.floor(1000 + Math.random() * 9000);
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
  });

  it('will sign up with referral code url', () => {
    let randomReferralCode = 'testcode' + Math.floor(1000 + Math.random() * 9000);
    cy.visit(`/register/${randomReferralCode}`);
    cy.wait(1500)
    // Enter user name
    let randomUserName = 'testUser' + Math.floor(1000 + Math.random() * 9000);
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
  });
});