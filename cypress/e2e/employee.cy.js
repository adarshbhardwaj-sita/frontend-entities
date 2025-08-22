describe("Master Portal - Employee Management", () => {
  beforeEach(() => {
    cy.visit("http://localhost:4200"); // replace with your app URL
  });

  it("should navigate to Employee Management", () => {
    cy.contains(".entity-card", "Employee").click();
    cy.url().should("include", "/employee");   
    cy.contains("Employee Management").should("be.visible");    
  });

  it("should add a new employee", () => {
    cy.contains(".entity-card", "Employee").click();
    cy.contains("Add Employee").click();

    // Fill employee form (adjust selectors as per your HTML structure)
    cy.get("input[name='employee_Id']").type("1");
    cy.get("input[name='name']").type("John Doe");
    cy.get("input[name='email']").type("john.doe@test.com");
    cy.get("input[name='department']").type("Engineering");
    cy.get("input[name='designation']").type("Developer");
    cy.get("form").submit();



    // Verify entry in employee directory
    cy.contains("John Doe").should("be.visible");
    cy.contains("john.doe@test.com").should("be.visible");
  });

  it("should search employee by ID", () => {
  cy.contains(".entity-card", "Employee").click();
  cy.get("input[placeholder*='Search by ID']").type("1");
  cy.contains("Search").click();

  cy.get("table").contains("td", "1").should("be.visible");
  });

  it("should edit employee details", () => {
    cy.contains(".entity-card", "Employee").click();

    // Click edit button for first row
    cy.get("table tbody tr").first().find("button[title ='Edit']").click();

    // Update designation
    cy.get("input[name='designation']").clear().type("Senior Developer");
    cy.get("form").submit();

    cy.contains("Senior Developer").should("be.visible");
  });

  it("should delete an employee", () => {
    cy.contains(".entity-card", "Employee").click();

    // Delete last employee in the list
    cy.get("table tbody tr").first().find("button[title='Delete']").click();

    // Confirm deletion if modal appears
    cy.on('window:confirm', () => true);

    // Verify deletion
    cy.get("table tbody tr").should("not.contain", "John Doe");
  });
});
