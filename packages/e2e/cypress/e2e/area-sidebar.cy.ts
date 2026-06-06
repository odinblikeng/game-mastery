/// <reference types="cypress" />

export {};

const visitAndWait = (path: string) => {
  cy.visit(path);
  cy.get('[data-testid="cy-app-shell"]').should("have.attr", "data-hydrated", "true");
};

describe("Area sidebar", () => {
  beforeEach(() => {
    visitAndWait("/?sidebar=areas");
  });

  it("shows all available areas", () => {
    cy.get('[data-testid^="cy-area-item-"]').should("have.length", 19);
    cy.get('[data-testid="cy-area-item-m1"]').should("contain", "Foyer and Hallway");
    cy.get('[data-testid="cy-area-item-m2"]').should("contain", "Patio");
    cy.get('[data-testid="cy-area-item-m3"]').should("contain", "Library");
  });

  it("filters by code and title", () => {
    cy.get('[data-testid="cy-area-search-input"]').type("M1");
    cy.get('[data-testid="cy-area-item-m1"]').should("exist");
    cy.get('[data-testid="cy-area-item-m10"]').should("exist");
    cy.get('[data-testid="cy-area-item-m2"]').should("not.exist");

    cy.get('[data-testid="cy-area-search-input"]').clear({ force: true });
    cy.get('[data-testid="cy-area-search-input"]').type("Library", { force: true });
    cy.get('[data-testid="cy-area-item-m3"]').should("be.visible");
    cy.get('[data-testid="cy-area-item-m13"]').should("exist");
  });

  it("shows an empty-state message when the search misses", () => {
    cy.get('[data-testid="cy-area-search-input"]').type("zzz");
    cy.contains("No areas match your search.").should("be.visible");
  });

  it("loads the selected area content into the main panel", () => {
    cy.get('[data-testid="cy-area-item-m1"]').click();

    cy.location("search").should("include", "area=m1");
    cy.get('[data-testid="cy-area-item-m1"]').should("have.class", "Mui-selected");
    cy.contains("Foyer and Hallway").should("be.visible");
    cy.contains("A dramatic arrival space with long sightlines").should("be.visible");
  });

  it("collapses the Areas sidebar and updates the URL when the collapse button is clicked", () => {
    cy.get('[data-testid="cy-area-search-input"]').should("be.visible");
    cy.get('[data-testid="cy-area-collapse-button"]').click();

    cy.get('[data-testid="cy-area-search-input"]').should("not.be.visible");
    cy.location("search").should("not.include", "sidebar=areas");
  });
});
