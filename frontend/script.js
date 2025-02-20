function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

document.getElementById("contact-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const button = document.getElementById("submit-button");
  const buttonText = document.getElementById("button-text");
  const spinner = document.getElementById("loading-spinner");
  const form = this;

  button.disabled = true;
  buttonText.innerText = "Sending...";
  spinner.classList.remove("hidden");

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (!data.name || !data.email || !data.message) {
    alert("Please fill in all fields.");
    button.disabled = false;
    buttonText.innerText = "Send message";
    spinner.classList.add("hidden");
    return;
  }

  const API_URL = window.location.hostname === "localhost" 
      ? "http://localhost:5000/send" 
      : "https://your-live-api.com/send";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to send message.");
    }

    document.getElementById("popup").classList.remove("hidden");
    form.reset();
  } catch (error) {
    const errorMessage = document.createElement("p");
    errorMessage.innerText = "Error sending message. Please try again.";
    errorMessage.className = "text-red-600 text-sm";
    form.appendChild(errorMessage);
  } finally {
    buttonText.innerText = "Send message";
    button.disabled = false;
    spinner.classList.add("hidden");
  }
});

document.getElementById("popup").addEventListener("click", function(event) {
  if (event.target === this) closePopup();
});
