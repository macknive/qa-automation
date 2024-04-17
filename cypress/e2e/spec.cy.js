const inpageButton = "#vs-inpage button"
const privacyPolicyCheck = "#linkText"
const onBoardingNext =
  "#vs-aoyama-main-modal > div[class^='_root'] > div:nth-child(3) > div > div:nth-child(3) > button"
const genderProceed =
  "#vs-aoyama-main-modal > div[class^='_root'] > div:nth-child(3) > div > div:nth-child(4) > button"
const bodyProceed =
  "#vs-aoyama-main-modal > div[class^='_root'] > div:nth-child(3) > div > div:nth-child(5) > button"

describe("Virtusize QA Automation", () => {
  before(() => {
    cy.visit("https://shop.adidas.jp/products/HR4607/")
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
        if (req.body.name === "user-opened-panel-tryiton") {
          tryItOn = true
        }
        //intercept response
        req.reply((res) => {
          if (
            res.url.includes("size-recommendation.virtusize") &&
            res.statusCode === 200
          ) {
            srapi = true
          }
        })
      }
    ).as("vsEvents")
    cy.wait("@vsEvents").then((interceptions) => {
      cy.get(inpageButton, { timeout: 20000 }).click()
      cy.get(privacyPolicyCheck, { timeout: 5000 }).next().click()
      cy.get(onBoardingNext, { timeout: 5000 }).click()
      cy.get(genderProceed, { timeout: 5000 }).first().click()
      cy.get(bodyProceed, { timeout: 5000 })
        .first()
        .click()
        .then(() => {
          setTimeout(() => {
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
          }, 3000)
        })
    })
  })
})
