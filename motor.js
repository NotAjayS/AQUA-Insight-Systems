 const motorSwitch = document.getElementById('motorSwitch');
  motorSwitch.addEventListener('change', () => {
    console.log(motorSwitch.checked ? 'Motor ON' : 'Motor OFF');
  });

  let text = document.getElementById("myText");

// Apply inline style from JS
text.style.fontSize = "28px"; // Increase font size
text.style.color = "#00eaff"; // Text color
text.style.textShadow = "0 0 5px #00eaff, 0 0 10px #00eaff, 0 0 20px #00eaff"; // Glow effect