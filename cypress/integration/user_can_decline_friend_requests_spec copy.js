describe("Friend Request", () => {
  it("a user can send decline friend requests", () => {
    // sign up John
    cy.visit("/users/new");
    cy.get("#name").type("John");
    cy.get("#email").type("john@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    // sign up Jane
    cy.visit("/users/new");
    cy.get("#name").type("Jane");
    cy.get("#email").type("jane@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    // sign in John
    cy.visit("/sessions/new");
    cy.get("#email").type("john@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    // John submits a post
    cy.visit("/posts");

    cy.contains("Make a post").click();
    cy.visit("/posts/new");
    cy.get("#message").type("Hi, I am John!");
    cy.get("#submit").click();

    // logout John
    cy.get("#logout").click();

    // sign in Jane
    cy.visit("/sessions/new");
    cy.get("#email").type("jane@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    // go to John's profile
    cy.get(".post:first")
      .find(".post-author:first")
      .within(() => {
        cy.get("a").click();
      });

    // click add friend
    cy.get("#add-friend-button").click();

    // expect page refresh with button grayed out
    cy.get("#pending-friends-button").should(
      "have.attr",
      "value",
      "Your friend request is still pending"
    );

    // logout Jane
    cy.get("#logout").click();

    // sign in John
    cy.visit("/sessions/new");
    cy.get("#email").type("john@example.com");
    cy.get("#password").type("password");
    cy.get("#submit").click();

    // go to settings and accept Jane's request
    cy.get("#settings-navbar").click();
    cy.get("#friend-requests").within(() => {
      cy.get(".friend-req-name:first").should("contain", "Jane");
      cy.get(".decline-button:first").click();
    });

    // refreshes without any requests
    cy.get("#friend-requests").should("not.exist");

    // go to John's profile
    cy.get("#home-button").click();
    cy.get(".post:first")
      .find(".post-author:first")
      .within(() => {
        cy.get("a").click();
      });

    // check for Jane in friends
    cy.get("#friends").should("not.exist");
  });
});
