describe("Virtusize QA Automation", () => {
  before(() => {
    cy.visit("https://demo.virtusize.com")
  })
  it("check network events", () => {
    cy.intercept(
      {
        method: "POST",
        url: /virtusize/,
      },
      (req) => {
        var userSaw
        if (req.body.name === "user-saw-widget-button") {
          userSaw = true
        }
      }
    ).as("vsEvents")
    // cy.wait("@vsEvents").then((interceptions) => {
    //   console.log("this", interceptions.response.body.name)
    //   //cy.get("#vs-inpage button").click()
    // })
  })
})
