import "./commands";

Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("Hydration") || err.message.includes("hydrating")) {
    return false;
  }

  return undefined;
});