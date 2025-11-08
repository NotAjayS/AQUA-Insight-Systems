function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "ajayhari@27") {
    window.location.href = "dashboard.html"; // Next page
  } else {
    alert("Incorrect credentials. Please try again.");
  }
}
