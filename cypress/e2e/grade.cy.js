describe("Master Portal - Grade Management", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200");
  });

  it("should navigate to Grade Management", () => {
    cy.contains(".entity-card", "Grade").click();
    cy.url().should("include", "/grade");
    cy.contains("Grade Management").should("be.visible");
  });

  it("should add a new grade", () => {
    cy.contains(".entity-card", "Grade").click();
    cy.contains("Add Grade").click();
    cy.get("input[name='gradeId']").type("1");
    cy.get("input[name='gradeLevel']").type("Abc");
    cy.get("textarea[name='gradeDescription']").type("Top grade");
    cy.get("form").submit();
    cy.contains("Abc").should("be.visible");
    cy.contains("Top grade").should("be.visible");
  });

  it("should search grade by ID", () => {
    cy.contains(".entity-card", "Grade").click();
    cy.get("input[placeholder*='Search by ID']").type("1");
    cy.contains("Search").click();
    cy.get("table").contains("td", "1").should("be.visible");
  });

  it("should edit grade details", () => {
    cy.contains(".entity-card", "Grade").click();
    cy.get("table tbody tr").first().find("button[title ='Edit']").click();
    cy.get("textarea[name='gradeDescription']").clear().type("Updated grade");
    cy.get("form").submit();
    cy.contains("Updated grade").should("be.visible");
  });

  it("should delete a grade", () => {
    cy.contains(".entity-card", "Grade").click();
    cy.get("table tbody tr").last().find("button[title='Delete']").click();
    
    cy.on('window:confirm', () => true);
    cy.get("table tbody tr").should("not.contain", "ABC");
  });
});
