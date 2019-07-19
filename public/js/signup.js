$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var userNameInput = $("input#userName-input");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      userName: userNameInput.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password || !userData.userName) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password, userData.userName);
    userNameInput.val("");
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password, userName) {

    $.post("/api/signup", {
      userName: userName,
      email: email,
      password: password
    })
      .then(function() {
        window.location.replace("/game");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr() {
    $("#alert .msg").text(
      "Sorry that account already exists, please try logging in."
    );
    $("#alert").fadeIn(500);
  }
});
