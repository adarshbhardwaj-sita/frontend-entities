describe("Master Portal - Journey Management", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should navigate to Journey Management", () => {
    cy.contains(".entity-card", "Journey").click();
    cy.url().should("include", "/journey");
    cy.contains("Journey Management").should("be.visible");
  });

  it("should add a new journey", () => {
    cy.contains(".entity-card", "Journey").click();
    cy.contains("Add Journey").click();
    cy.get("input[name='journeyId']").type("1000000");
    cy.get("input[name='journeyName']").type("Onboarding");
    cy.get("textarea[name='journeyDescription']").type("Onboarding process");
    cy.get("input[name='destination']").type("abcd");
    cy.get("input[name='durationInDays']").type("10");
    cy.get("input[name='budget']").type("10");
    cy.get("form").submit();
    cy.contains("Onboarding").should("be.visible");
    cy.contains("Onboarding process").should("be.visible");
  });

  it("should search journey by ID", () => {
    cy.contains(".entity-card", "Journey").click();
    cy.get("input[placeholder*='Search by ID']").type("1");
    cy.contains("Search").click();
    cy.get("table").contains("td", "1").should("be.visible");
  });

  it("should edit journey details", () => {
    cy.contains(".entity-card", "Journey").click();
    cy.get("table tbody tr").first().find("button[title ='Edit']").click();
    cy.get("textarea[name='journeyDescription']").clear().type("Updated journey");
    cy.get("form").submit();
    cy.contains("Updated journey").should("be.visible");
  });

  it("should delete a journey", () => {
    cy.contains(".entity-card", "Journey").click();
   cy.get("table tbody tr").last().find("button[title='Delete']").click();
    cy.on('window:confirm', () => true);
    cy.get("table tbody tr").should("not.contain", "Onboarding");
  });
});
