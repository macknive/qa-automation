// cypress.config.js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        async postMessageToSlack({ token, channel, message }) {
          const fetch = await import("node-fetch").then((mod) => mod.default)

          const url = "https://slack.com/api/chat.postMessage"
          const data = {
            channel: channel,
            text: message,
          }

          return fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.ok) {
                return { success: true, data: data }
              } else {
                throw new Error(`Error sending message: ${data.error}`)
              }
            })
            .catch((error) => {
              throw new Error(`Fetch error: ${error.message}`)
            })
        },
      })

      return config
    },
  },
})
