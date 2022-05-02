describe('Navigation', () => {
  it('should navigate to the about page', () => {
    // Start from the index page
    cy.visit(`${process.env.BASE_URL}`)

    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="ランキング"]').click()

    // The new url should include "/about"
    cy.url().should('include', '/ranking')

    // The new page should contain an h1 with "About page"
    cy.get('h1').contains('みんなのランキング')
  })
})