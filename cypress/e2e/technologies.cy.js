describe("Master Portal - Technologies Management", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should navigate to Technologies Management", () => {
    cy.contains(".entity-card", "Technologies").click();
    cy.url().should("include", "/technologies");
    cy.contains("Technology Management").should("be.visible");
  });

  it("should add a new technology", () => {
    cy.contains(".entity-card", "Technologies").click();
    cy.contains("Add Technology").click();
    cy.get("input[name='id']").type("1");
    cy.get("textarea[name='technologyStack']").type("Angular");   
    cy.get("form").submit();
    cy.contains("Angular").should("be.visible");
    
  });

  it("should search technology by ID", () => {
    cy.contains(".entity-card", "Technologies").click();
    cy.get("input[placeholder*='Search by ID']").type("1");
    cy.contains("Search").click();
    cy.get("table").contains("td", "1").should("be.visible");
  });

  it("should edit technology details", () => {
    cy.contains(".entity-card", "Technologies").click();
    cy.get("table tbody tr").first().find("button[title ='Edit']").click();
    cy.get("textarea[name='technologyStack']").clear().type("Updated technology");
    cy.get("form").submit();
    cy.contains("Updated technology").should("be.visible");
  });

  it("should delete a technology", () => {
    cy.contains(".entity-card", "Technologies").click();
    cy.get("table tbody tr").contains("td", "1").parent().find("button[title='Delete']").click();
    cy.on('window:confirm', () => true);
    cy.get("table tbody tr").should("not.contain", "Angular");
  });
});
