const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    const submitButton = contactForm.querySelector('button[type="submit"]');
          submitButton.disabled = true;
          submitButton.textContent = "Sending...";

    try {
        const response = await fetch("https://krushnamanthalkar-developerportfolio.onrender.com/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: message
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Message sent successfully!");
            contactForm.reset();
        } else {
            alert(data.message || "Failed to send message.");
        }

        submitButton.disabled = false;
        submitButton.textContent = "Send Message";

    } catch (error) {
        console.error("Error:", error);
        alert("Unable to connect to the server");
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
    }
});