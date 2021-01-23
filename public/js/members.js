$(document).ready(() => {
  // Getting references to our form and input
  const userDetailsForm = $("form.userDetails");
  const fNameInput = $("input#fName-input");
  const lNameInput = $("input#lName-input");
  const uNameInput = $("input#uName-input");

  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
    if (data.UserDetail) {
      fNameInput.val(data.UserDetail.firstName);
      lNameInput.val(data.UserDetail.lastName);
      uNameInput.val(data.UserDetail.userName);
    }
  });
  
  // When the signup button is clicked, we validate the email and password are not blank
  userDetailsForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      firstName: fNameInput.val().trim(),
      lastName: lNameInput.val().trim(),
      userName: uNameInput.val().trim()
    };

    if (!userData.firstName || !userData.lastName || !userData.userName) {
      return;
    }
    // If we have all three names, run the storeUserDetails function
    storeUserDetails(userData.firstName, userData.lastName, userData.userName);
    fNameInput.val("");
    lNameInput.val("");
    uNameInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function storeUserDetails(fName, lName, uName) {
    $.ajax("/api/userDetails", {
      method: "update",
      data: {
        firstName: fName,
        lastName: lName,
        userName: uName
      }
    })
      .then(() => {
        console.log("in the reroute to trivia")
        window.location.replace("/trivia");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
  }

});
