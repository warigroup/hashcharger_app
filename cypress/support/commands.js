// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

Cypress.Commands.add("login", (email, password) => { 
    //not using any passed params for now.
    cy.visit ('/login');
    //Enter username
    cy.get('#username-input') .type('cypress').should('have.value', 'cypress')
    //Enter Pass
    cy.get('#password-input').type('password').should('have.value', 'password')    
    cy.get('#login-form').submit()
 })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
