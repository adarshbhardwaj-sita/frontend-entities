describe("Master Portal - Role Management", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should navigate to Role Management", () => {
    cy.contains(".entity-card", "Role").click();
    cy.url().should("include", "/role");
    cy.contains("Role Management").should("be.visible");
  });

  it("should add a new role", () => {
    cy.contains(".entity-card", "Role").click();
    cy.contains("Add Role").click();
    cy.get("input[name='role_Id']").type("1");
    cy.get("input[name='role_Title']").type("Test Role");
    cy.get("input[name='project_Name']").type("Test role description");
    cy.get("form").submit();
    cy.contains("Test Role").should("be.visible");
    cy.contains("Test role description").should("be.visible");
  });

  it("should search role by ID", () => {
    cy.contains(".entity-card", "Role").click();
    cy.get("input[placeholder*='Search by ID']").type("1");
    cy.contains("Search").click();
    cy.get("table").contains("td", "1").should("be.visible");
  });

  it("should edit role details", () => {
    cy.contains(".entity-card", "Role").click();
    cy.get("table tbody tr").first().find("button[title ='Edit']").click();
    cy.get("input[name='project_Name']").clear().type("Updated role description");
    cy.get("form").submit();
    cy.contains("Updated role description").should("be.visible");
  });

  it("should delete a role", () => {
    cy.contains(".entity-card", "Role").click();
   cy.get("table tbody tr").last().find("button[title='Delete']").click();
    cy.on('window:confirm', () => true);
    cy.get("table tbody tr").should("not.contain", "Test Role");
  });
});
