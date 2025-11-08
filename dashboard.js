document.addEventListener("DOMContentLoaded", () => {
  // Step 1: Fade out welcome text after 1.5s
  setTimeout(() => {
    document.getElementById("welcomeText").classList.add("fade-out");
  }, 1500);

  // Step 2: Hide welcome, show particles + dock after 2.2s
  setTimeout(() => {
    const welcome = document.getElementById("welcomeText");
    welcome.style.display = "none";

    // Create 50 floating particles
    const container = document.getElementById("particles-container");
    for (let i = 0; i < 50; i++) {
      const dot = document.createElement("div");
      dot.className = "particle";
      dot.style.width = `${Math.random() * 6 + 4}px`;
      dot.style.height = dot.style.width;
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 2 + 0.8}s`;
      container.appendChild(dot);
    }

    // Show dock panel
    document.getElementById("dockPanel").style.display = "flex";
  }, 2200);

  // Step 3: Animate "MyDashboard" title (letter-by-letter) after 2.6s
  setTimeout(() => {
    const title = document.getElementById("dashboardTitle");
    const text = title.textContent.trim();
    title.innerHTML = "";
    text.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.animationDelay = `${i * 0.05}s`;
      title.appendChild(span);
    });
    title.style.opacity = "1";
  }, 2600);

  // Step 4: After 3.5s, move title up and SHOW CONTENT
  setTimeout(() => {
    const title = document.getElementById("dashboardTitle");
    const myDashboard = document.getElementById("myDashboard");
    const aboutText = document.getElementById("aboutText");

    // Move title to top
    title.classList.add("move-to-top");

    // Hide animation, show content
    myDashboard.style.display = "none";
    aboutText.style.display = "block"; // Makes content appear
  }, 3500);
});




// After all other animations complete (3.5s)
setTimeout(() => {
  const myDashboard = document.getElementById("myDashboard");
  const aboutText = document.getElementById("aboutText");
  
  // Hide animation
  myDashboard.style.display = "none";
  
  // Show about content
  aboutText.style.display = "block";
  
  // Trigger fade-in after a tiny delay
  setTimeout(() => {
    aboutText.style.opacity = "1";
    aboutText.classList.add("show");
  }, 50);
}, 3500);


const dockItems = document.querySelectorAll(".dock-item");

  dockItems.forEach(item => {
    item.addEventListener("click", () => {
      const page = item.getAttribute("data-page");
      if (page) {
        window.location.href = page;  // Redirect to that HTML page
      }
    });
  });