/// <reference types="cypress" />

export {};

const visitAndWait = (path: string) => {
  cy.visit(path);
  cy.get('[data-testid="cy-app-shell"]').should("have.attr", "data-hydrated", "true");
};

describe("Area sidebar", () => {
  it("shows all available areas", () => {
    visitAndWait("/?sidebar=areas");

    cy.get('[data-testid="cy-area-count-chip"]').should("contain", "3 entries");
    cy.get('[data-testid="cy-area-item-m1"]').should("contain", "Foyer and Hallway");
    cy.get('[data-testid="cy-area-item-m2"]').should("contain", "Patio");
    cy.get('[data-testid="cy-area-item-m3"]').should("contain", "Library");
  });

  it("filters by code and title", () => {
    visitAndWait("/?sidebar=areas");

    cy.get('[data-testid="cy-area-search-input"]').type("M1");
    cy.get('[data-testid="cy-area-count-chip"]').should("contain", "1 entry");
    cy.get('[data-testid="cy-area-item-m1"]').should("be.visible");
    cy.get('[data-testid="cy-area-item-m2"]').should("not.exist");
    cy.get('[data-testid="cy-area-item-m3"]').should("not.exist");

    cy.get('[data-testid="cy-area-search-input"]').clear().type("Library");
    cy.get('[data-testid="cy-area-count-chip"]').should("contain", "1 entry");
    cy.get('[data-testid="cy-area-item-m3"]').should("be.visible");
  });

  it("shows an empty-state message when the search misses", () => {
    visitAndWait("/?sidebar=areas");

    cy.get('[data-testid="cy-area-search-input"]').type("zzz");
    cy.contains("No areas match your search.").should("be.visible");
  });

  it("loads the selected area content into the main panel", () => {
    visitAndWait("/?sidebar=areas");

    cy.get('[data-testid="cy-area-item-m1"]').click();

    cy.location("search").should("include", "area=m1");
    cy.get('[data-testid="cy-area-item-m1"]').should("have.class", "Mui-selected");
    cy.contains("Foyer and Hallway").should("be.visible");
    cy.contains("A dramatic arrival space with long sightlines").should("be.visible");
  });

  it("closes the area sidebar and clears the selected area", () => {
    visitAndWait("/?sidebar=areas&area=m1");

    cy.get('[data-testid="cy-area-sidebar-close"]').click();

    cy.location("search").should("eq", "");
    cy.get('[data-testid="cy-area-search-input"]').should("not.exist");
    cy.contains("Open the area compendium or session tools from the header to get started.").should(
      "be.visible",
    );
  });
});