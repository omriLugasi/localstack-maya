

const uploadFileFlow = (cy, filePath, file) => {
  // Click on update file
  cy.get(`button[data-qa="s3-upload-file-button"]`).click()

  // type file name on the file input path
  cy.get('input[data-qa="upload-s3-file-path-input"]').type(filePath)


  cy.get('input[type=file]').selectFile({
    contents: file|| Cypress.Buffer.from('file contents'),
    fileName: 'file.txt',
    lastModified: Date.now(),
  })

  cy.get('button[data-qa="upload-file-to-s3-submit-button"]').click()
}

describe('S3 flow spec', () => {

  context('happy flow', () => {
    const randomS3RegularBucketName = `s3-bucket-${Date.now()}`
    const randomS3BucketName = `s3-bucket-versioned-${Date.now()}`


    it ('should navigate to website', () => {
      cy.visit('http://127.0.0.1:5173')

      cy.get('div[data-qa="S3-service"]').click()

      cy.url().should('include', '/S3')
    })

    it('create bucket to work on', () => {

      cy.visit('http://127.0.0.1:5173/S3')

      // Click on open create s3 bucket dialog
      cy.get('button[data-qa="s3-create-bucket"]').click()

      // Type inside an input on create dialog
      cy.get('input[data-qa="upload-s3-bucket-name-input"]').type(randomS3RegularBucketName)

      // Click on submit form on create s3 bucket entity
      cy.get('button[data-qa="s3-create-bucket-submit-button"]').click()

      // CREATE BUCKET WITH VERSIONS

      // Click on open create s3 bucket dialog
      cy.get('button[data-qa="s3-create-bucket"]').click()

      // Type inside an input on create dialog
      cy.get('input[data-qa="upload-s3-bucket-name-input"]').type(randomS3BucketName)

      // set versioned bucket as true
      cy.get('input[data-qa="s3-create-bucket-with-version-checkbox"]').click()

      // Click on submit form on create s3 bucket entity
      cy.get('button[data-qa="s3-create-bucket-submit-button"]').click()

    })

    it('work on regular bucket', () => {

      cy.visit('http://127.0.0.1:5173/S3')

      // find the regular bucket
      cy.get('input[data-qa="search-s3-by-name"]').clear()
      cy.get('input[data-qa="search-s3-by-name"]').type(randomS3RegularBucketName)

      // Click on the bucket to navigate to the bucket page
      cy.get(`span[data-qa="s3-bucket-column-name-${randomS3RegularBucketName}"]`).click()

      // check the url
      cy.url().should('include', `/S3/bucket/${randomS3RegularBucketName}`)

      uploadFileFlow(cy, 'A/B/C/r.txt')

      cy.get('span[data-qa="s3-file-column-name-A/"]').click()

      cy.get('span[data-qa="s3-file-column-name-B/"]').click()

      cy.get('span[data-qa="s3-file-column-name-C/"]').click()

      cy.get('span[data-qa="s3-file-column-name-r.txt"]').click()

      cy.get('span[data-qa="s3-bucket-column-latest-index-0"]').should('contain', 'true')

    })

    it('work on versioned bucket', () => {
      cy.visit('http://127.0.0.1:5173/S3')

      // find the regular bucket
      cy.get('input[data-qa="search-s3-by-name"]').clear()
      cy.get('input[data-qa="search-s3-by-name"]').type(randomS3BucketName)

      // Click on the bucket to navigate to the bucket page
      cy.get(`span[data-qa="s3-bucket-column-name-${randomS3BucketName}"]`).click()

      // check the url
      cy.url().should('include', `/S3/bucket/${randomS3BucketName}`)

      uploadFileFlow(cy, 'A/B/C/r.txt')

      uploadFileFlow(cy, 'A/B/C/r.txt')

      cy.get('span[data-qa="s3-file-column-name-A/"]').click()

      cy.get('span[data-qa="s3-file-column-name-B/"]').click()

      cy.get('span[data-qa="s3-file-column-name-C/"]').click()

      cy.get('span[data-qa="s3-file-column-name-r.txt"]').click()

      cy.get('span[data-qa="s3-bucket-column-latest-index-0"]').should('contain', 'true')

      cy.get('span[data-qa="s3-bucket-column-latest-index-1"]').should('contain', 'false')
    })

    it.skip('delete the created buckets', () => {
      // delete the buckets
      cy.visit('http://127.0.0.1:5173/S3')

      cy.get('input[data-qa="search-s3-by-name"]').type(randomS3RegularBucketName)

      // click on check box
      cy.get(`input[data-qa="bucket-checkbox-${randomS3RegularBucketName}"]`).click()

      // click on delete button
      cy.get('button[data-qa="s3-delete-selected-bucket"]').click()

      // do the same for verioned.

      cy.get('input[data-qa="search-s3-by-name"]').clear()

      cy.get('input[data-qa="search-s3-by-name"]').type(randomS3BucketName)

      // click on check box
      cy.get(`input[data-qa="bucket-checkbox-${randomS3BucketName}"]`).click()

      // click on delete button
      cy.get('button[data-qa="s3-delete-selected-bucket"]').click()
    })

  })
})
