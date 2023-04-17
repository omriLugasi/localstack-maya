describe('Sqs flow spec', () => {
  it('happy flow', () => {
    const randomSqsName = `sqs-${Date.now()}`
    const message = `
      this is an example for a message
      ${randomSqsName}
    `
    cy.visit('http://127.0.0.1:5173')

    cy.get('div[data-qa="SQS-service"]').click()

    cy.url().should('include', '/SQS')

    // Click on open create sqs dialog
    cy.get('button[data-qa="button-show-create-sqs-dialog"]').click()

    // Type inside an input on create dialog
    cy.get('input[data-qa="sqs-name-input"]').type(randomSqsName)

    // Click on create sqs dialog
    cy.get('button[data-qa="create-sqs-queue"]').click()

    // Find the queue by name
    cy.get('input[data-qa="search-sqs-queue-by-name"]').type(randomSqsName)

    // Find the queue by name
    cy.get(`span[data-qa="sqs-queue-column-name-${randomSqsName}"]`).click()

    // write some message in the text area
    cy.get('textarea[data-qa="sqs-push-message-input"]').type(message)

    // send the message that we wrote to the queue.
    cy.get('button[data-qa="sqs-push-message-button"]').click()

    // pull messages from the queue
    cy.get(`button[data-qa="sqs-pull-message-button"]`).click()

    // click on the retrieve message
    cy.get(`span[data-qa="message-link-1"]`).click()

    // validate that message actually exists on the drawer
    cy.get(`span[data-qa="sqs-drawer-message-body"]`).should('contain', message)

    // peform trigger of ESC to close the drawer
    cy.get('body').trigger('keydown', { keyCode: 27 })

    // click on the retrieve message
    cy.get(`span[data-qa="message-checkbox-1"]`).click()

    // click on the button to ack the messages that we mark in the previous step
    cy.get(`button[data-qa="sqs-ack-message-button"]`).click()

    // Delete the SQS queue
    cy.get(`button[data-qa="sqs-delete-queue"]`).click()

  })
})
