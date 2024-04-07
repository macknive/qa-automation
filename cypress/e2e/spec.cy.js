describe("Virtusize QA Automation", () => {
  before(() => {
    cy.visit("https://demo.virtusize.com")
  })
  it("check network events", () => {
    cy.intercept(
      {
        method: "GET",
        url: /virtusize/,
      },
      (req) => {
        req.reply((res) => {
          if (res.body.name === "backend-checked-product") {
            console.log(res)
            expect(res.body.data.validProduct).to.be.true
          }
        })
      }
    )
    cy.intercept(
      {
        method: "POST",
        url: /virtusize/,
      },
      (req) => {
        if (req.body.name === "user-saw-widget-button") {
          expect(true).to.be.true
        }
        if (req.body.name === "user-opened-widget") {
          console.log("opened widget")
          expect(true).to.be.true
        }
      }
    ).as("vsEvents")
    cy.wait("@vsEvents").then((interceptions) => {
      console.log("this", interceptions.response.body.name)
      cy.get("#vs-inpage button").click()
    })
  })
})
