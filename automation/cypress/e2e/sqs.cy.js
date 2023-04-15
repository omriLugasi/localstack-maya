describe('Sqs flow spec', () => {
  it('passes', () => {
    cy.visit('http://127.0.0.1:5173')

    cy.get('div[data-qa="SQS-service"]').click()

    cy.url().should('include', '/SQS')

    // Click on open create sqs dialog
    cy.get('button[data-qa="button-show-create-sqs-dialog"]').click()

    const randomSqsName = `sqs-${Date.now()}`

    // Type inside an input on create dialog
    cy.get('input[data-qa="sqs-name-input"]').type(randomSqsName)

    // Click on create sqs dialog
    cy.get('button[data-qa="create-sqs-queue"]').click()

    // Find the queue by name
    cy.get('input[data-qa="search-sqs-queue-by-name"]').type(randomSqsName)

    // Find the queue by name
    cy.get(`span[data-qa="sqs-queue-column-name-${randomSqsName}"]`).click()

    // write some message in the text area
    cy.get('textarea[data-qa="sqs-push-message-input"]').type(`
      this is an example for a message
      ${randomSqsName}
    `)

    // send the message that we wrote to the queue.
    cy.get('button[data-qa="sqs-push-message-button"]').click()
  })
})
