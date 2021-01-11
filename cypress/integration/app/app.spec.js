/// <reference types="cypress" />
describe('App', () => {
    
    before(() => cy.visit('http://localhost:19006/'))

    specify('Whatever', async () => {
        await cy.contains('Create new note').click()
        expect(cy.contains(/Save/)).to.be.ok
    })

    specify("Second whatever", async () => {
        expect(cy.contains(/Save/)).to.be.ok
        await cy.contains('Settings').click()

        cy.contains('Explorer').click()
    })
})