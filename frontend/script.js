function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

document.getElementById("contact-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  // Get references to UI elements
  const button = document.getElementById("submit-button");
  const buttonText = document.getElementById("button-text");
  const spinner = document.getElementById("loading-spinner");
  const form = this;

  // Disable the button and show the spinner
  button.disabled = true;
  buttonText.innerText = "Sending...";
  spinner.classList.remove("hidden");

  // Collect form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Validate form fields
  if (!data.name || !data.email || !data.message) {
    alert("Please fill in all fields.");
    button.disabled = false;
    buttonText.innerText = "Send message";
    spinner.classList.add("hidden");
    return;
  }

  // Determine the API URL based on the environment
  const API_URL =
    window.location.hostname.includes("localhost")
      ? "http://localhost:5000/api/send" // Local testing
      : "https://portfolio-38x25kar4-thiens-projects-26bef224.vercel.app/api/send"; // Vercel deployment

  try {
    // Send the POST request to the API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Handle non-OK responses
    if (!response.ok) {
      throw new Error("Failed to send message.");
    }

    // Show success popup and reset the form
    document.getElementById("popup").classList.remove("hidden");
    form.reset();
  } catch (error) {
    console.error("Error:", error);

    // Remove old error messages before adding a new one
    const existingErrorMessage = form.querySelector(".text-red-600");
    if (existingErrorMessage) {
      existingErrorMessage.remove();
    }

    const errorMessage = document.createElement("p");
    errorMessage.innerText = "Error sending message. Please try again.";
    errorMessage.className = "text-red-600 text-sm";
    form.appendChild(errorMessage);
  } finally {
    // Re-enable the button and hide the spinner
    buttonText.innerText = "Send message";
    button.disabled = false;
    spinner.classList.add("hidden");
  }
});

// Ensure popup exists before adding an event listener
const popup = document.getElementById("popup");
if (popup) {
  popup.addEventListener("click", function (event) {
    if (event.target === this) closePopup();
  });
}
