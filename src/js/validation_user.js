// Document is ready
$(document).ready(function () {

    // Validate Username
    $("#usercheck").hide();
    let usernameError = true;
    $("#userName").keyup(function () {
        validateUsername();
    });


    function CheckUsernameExist() {
        let usernameValue = $("#userName").val();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText == true) {
                    $("#usercheck").show();
                    $("#usercheck").html("user name exist in database");
                    usernameError = false;
                    return false;
                }
            }
        };
        const token = localStorage.getItem('token')
        // Gửi yêu cầu tới API
        xhttp.open("GET", "https://localhost:7065/api/User/CheckUsernameExist/" + usernameValue, true);
        // Thiết lập header Authorization với giá trị token
        xhttp.setRequestHeader("Authorization", "Bearer " + token);
        xhttp.send();
    }

    function validateUsername() {
        let usernameValue = $("#userName").val();
        if (usernameValue.length == "") {
            $("#usercheck").show();
            usernameError = false;
            return false;
        } else if (usernameValue.length < 3 || usernameValue.length > 10) {
            $("#usercheck").show();
            $("#usercheck").html("**length of username must be between 3 and 10");
            usernameError = false;
            return false;
        } else {
            $("#usercheck").hide();
        }
    }

    $("#emailvalid").hide();
    let emailError = true;
    $("#email").keyup(function () {
        validateEmail();
    });

    function validateEmail() {
        // Validate Email
        const email = document.getElementById("email");
        email.addEventListener("blur", () => {
            let regex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;
            let s = email.value;
            if (regex.test(s)) {
                email.classList.remove("is-invalid");
                emailError = true;
            } else {
                email.classList.add("is-invalid");
                emailError = false;
            }
        });
    }


    // Validate Password
    $("#passcheck").hide();
    let passwordError = true;
    $("#password").keyup(function () {
        validatePassword();
    });
    function validatePassword() {
        let passwordValue = $("#password").val();
        if (passwordValue.length == "") {
            $("#passcheck").show();
            passwordError = false;
            return false;
        }
        if (passwordValue.length < 3 || passwordValue.length > 10) {
            $("#passcheck").show();
            $("#passcheck").html(
                "**length of your password must be between 3 and 10"
            );
            $("#passcheck").css("color", "red");
            passwordError = false;
            return false;
        } else {
            $("#passcheck").hide();
        }
    }

    // Validate Confirm Password
    $("#conpasscheck").hide();
    let confirmPasswordError = true;
    $("#conpassword").keyup(function () {
        validateConfirmPassword();
    });
    function validateConfirmPassword() {
        let confirmPasswordValue = $("#conpassword").val();
        let passwordValue = $("#password").val();
        if (passwordValue != confirmPasswordValue) {
            $("#conpasscheck").show();
            $("#conpasscheck").html("**Password didn't Match");
            $("#conpasscheck").css("color", "red");
            confirmPasswordError = false;
            return false;
        } else {
            $("#conpasscheck").hide();
        }
    }

    // Submit button
    $("#submitbtn").click(function () {
        CheckUsernameExist();
        validateUsername();
        validatePassword();
        validateConfirmPassword();
        validateEmail();
        if (
            usernameError == true && emailError == true
        ) {
            return true;
        } else {
            return false;
        }
    });
});