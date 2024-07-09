const inpageButton = "#vs-inpage button"
const privacyPolicyCheck = "#linkText"
const onBoardingNext =
  "#vs-aoyama-main-modal > div[class^='_root'] > div:nth-child(3) > div > div:nth-child(3) > button"
const genderProceed =
  "#vs-aoyama-main-modal > div[class^='_root'] > div:nth-child(3) > div > div:nth-child(4) > button"
// const bodyProceed =
//   "#vs-aoyama-main-modal > div[class^='_root'] > div:nth-child(3) > div > div:nth-child(5) > button"

describe("Virtusize QA Automation", () => {
  before(() => {
    //priority **
    //get random pdp from backend API fetch
    //loop through store list and use backend API random product

    const url = "https://demo.virtusize.com/"
    //categoryToCheck = "" //custom category
    cy.visit(url)
  })
  it("check network events", () => {
    var validProduct,
      sawWidget,
      openedWidget,
      sawOnboardingScreen,
      createdSilhouette,
      tryItOn,
      srapi
    cy.intercept(
      {
        method: "GET",
        url: /virtusize/,
      },
      (req) => {
        req.reply((res) => {
          //add desktop/mobile.source.js call
          //here -->
          if (res.body.name === "backend-checked-product") {
            validProduct = res.body.data.validProduct
          }
        })
        //get response value here
      }
    )
    cy.intercept(
      {
        method: "POST",
        url: /.*virtusize.*/,
      },
      (req) => {
        if (req.body.name === "user-saw-widget-button") {
          sawWidget = true
        }
        if (req.body.name === "user-opened-widget") {
          openedWidget = true
        }
        if (req.body.name === "user-saw-onboarding-screen") {
          sawOnboardingScreen = true
        }
        if (req.body.name === "user-created-silhouette") {
          createdSilhouette = true
        }
        //add user-selected-size here

        if (req.body.name === "user-opened-panel-tryiton") {
          tryItOn = true
        }
        //detect if there is user-saw-visor exception event

        //intercept response
        req.reply((res) => {
          if (
            res.url.includes("size-recommendation.virtusize") &&
            res.statusCode === 200
          ) {
            //screenshot of silhouette addition
            expect(true).to.be.true
            srapi = true
          }
        })
      }
    ).as("vsEvents")
    cy.wait("@vsEvents").then((interceptions) => {
      cy.get(inpageButton, { timeout: 15000 }).click()
      cy.get(privacyPolicyCheck, { timeout: 15000 }).next().click()
      cy.get(onBoardingNext, { timeout: 5000 }).click()
      cy.get(genderProceed, { timeout: 5000 })
        .first()
        .click()
        //cy.get(bodyProceed, { timeout: 10000 })
        // .first()
        // .click()
        .then(() => {
          cy.wait(3000).then(() => {
            //TODO: separate section to PDC, data science and events
            const data = {
              isValidProduct: validProduct,
              userSawWidget: sawWidget,
              userOpenedWidget: openedWidget,
              userSawOnboardingScreen: sawOnboardingScreen,
              userCreatedSilhouette: createdSilhouette,
              userOpenedPanelTryiton: tryItOn,
              sizeRecommendation: srapi,
            }
            console.log(data)
            // temporary disabled sending to slack
            // need to get slack token from Rish
            //sendToSlack(data)
          })
        })

      console.log("done")
    })
  })
})

function sendToSlack(data) {
  console.log("sending to slack")
  const token = Cypress.env("slack_token")
  const channel = Cypress.env("slack_channel")
  let message

  if (typeof data === "object" && data !== null) {
    message = JSON.stringify(data)
  } else {
    message = "Invalid data"
  }

  console.log("message: ", message)

  cy.task("postMessageToSlack", {
    token,
    channel,
    message,
  })
}
