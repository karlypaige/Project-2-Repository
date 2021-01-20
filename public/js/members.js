$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
  });

    // Getting references to our form and input
    const userDetailsForm = $("form.userDetails");
    const fNameInput = $("input#fName-input");
    const lNameInput = $("input#lName-input");
    const uNameInput = $("input#uName-input");
  
    // When the signup button is clicked, we validate the email and password are not blank
    userDetailsForm.on("submit", event => {
      event.preventDefault();
      const userData = {
        first_name: fNameInput.val().trim(),
        last_name: lNameInput.val().trim(),
        user_name: uNameInput.val().trim()
      };
  
      if (!userData.first_name || !userData.last_name || !userData.user_name) {
        return;
      }
      // If we have all three names, run the storeUserDetails function
      storeUserDetails(userData.first_name, userData.last_name, userData.user_name);
      fNameInput.val("");
      lNameInput.val("");
      uNameInput.val("");
    });
  
    // Does a post to the signup route. If successful, we are redirected to the members page
    // Otherwise we log any errors
    function storeUserDetails(fName, lName, uName) {
      $.post("/api/userDetails", {
        first_name: fName,
        last_name: lName,
        user_name: uName
      })
        .then(() => {
          window.location.replace("/game");
          // If there's an error, handle it by throwing up a bootstrap alert
        })
        .catch(handleLoginErr);
    }

});
