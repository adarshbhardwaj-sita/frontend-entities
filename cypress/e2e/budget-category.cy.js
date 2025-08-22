describe("Master Portal - Budget Category Management", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should navigate to Budget Category Management", () => {
    cy.contains(".entity-card", "Budget").click();
    cy.url().should("include", "/budget-category");
    cy.contains("Budget Category Management").should("be.visible");
  });

  it("should add a new budget category", () => {
    cy.contains(".entity-card", "Budget").click();
    cy.contains("Add Category").click();

    cy.get("input[name='id']").type("1");
    cy.get("input[name='categoryType']").type("Travel");
    cy.get("input[name='budgetAmount']").type("100");
    cy.get("input[name='financialYear']").type("2024");

    cy.get("form").submit();
    cy.contains("Travel").should("be.visible");
    
  });

  it("should search budget category by ID", () => {
    cy.contains(".entity-card", "Budget").click();
    cy.get("input[placeholder*='Search by ID']").type("1");
    cy.contains("Search").click();
    cy.get("table").contains("td", "1").should("be.visible");
  });

  it("should edit budget category details", () => {
    cy.contains(".entity-card", "Budget").click();
    cy.get("table tbody tr").first().find("button[title ='Edit']").click();
    cy.get("input[name='categoryType']").clear().type("Updated description");
    cy.get("form").submit();
    cy.contains("Updated description").should("be.visible");
  });

  it("should delete a budget category", () => {
    cy.contains(".entity-card", "Budget").click();
    cy.get("table tbody tr").contains("td", "1").parent().find("button[title='Delete']").click();
    cy.on('window:confirm', () => true);
    cy.get("table tbody tr").should("not.contain", "Travel");
  });
});
