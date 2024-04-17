describe("Virtusize QA Automation", () => {
  before(() => {
    cy.visit("https://shop.adidas.jp/products/HR4607/")
  })
  it("check network events", () => {
    var validProduct, sawWidget, openedWidget
    cy.intercept(
      {
        method: "GET",
        url: /virtusize/,
      },
      (req) => {
        req.reply((res) => {
          if (res.body.name === "backend-checked-product") {
            validProduct = res.body.data.validProduct
            console.log("val", validProduct)
          }
        })
        //get response value here
      }
    )
    cy.intercept(
      {
        method: "POST",
        url: /virtusize/,
      },
      (req) => {
        if (req.body.name === "user-saw-widget-button") {
          sawWidget = true
        }
        if (req.body.name === "user-opened-widget") {
          openedWidget = true
        }
        //track events here
      }
    ).as("vsEvents")
    cy.wait("@vsEvents").then((interceptions) => {
      cy.get("#vs-inpage button", { timeout: 10000 }).click()
      // add clickables here
      setTimeout(() => {
        const data = {
          isValidProduct: validProduct,
          userSawWidget: sawWidget,
          userOpenedWidget: openedWidget,
        }
        console.log(data)
      }, 5000)
    })
  })
})
