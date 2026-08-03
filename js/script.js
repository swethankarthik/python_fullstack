// NRIIT LMS - Interactive JavaScript Logic

console.log("Welcome to NRIIT Learning Management System");

let heading = document.getElementById("welcome");
if (heading) {
    heading.innerHTML = "Welcome Future Software Engineers";
    console.log("Heading element: ", heading);
}

let msg = document.getElementById("message");
if (msg) {
    msg.innerHTML = "Javascript is fun";
    console.log("Message element: ", msg);
}

function showmessage() {
    alert("Welcome to NRIIT Learning Management System");
}

function changeHeading() {
    let welcomeElem = document.getElementById("welcome");
    if (welcomeElem) {
        welcomeElem.innerHTML = "Welcome Python Fullstack Developers";
    }
}

let heading1 = document.querySelector("#welcome");
if (heading1) {
    console.log("Heading element: ", heading1);
}

let button = document.getElementById("btnGreeting");
if (button) {
    button.addEventListener("click", function () {
        alert("Welcome to javascript Event Handling");
    });
}

let registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission
        let nameElem = document.getElementById("name");
        let emailElem = document.getElementById("email");
        let passwordElem = document.getElementById("password");

        let name = nameElem ? nameElem.value : "";
        let email = emailElem ? emailElem.value : "";
        let password = passwordElem ? passwordElem.value : "";

        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }
        alert("Registration successful!");

        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Password:", password);
    });
}
