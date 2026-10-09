const contactForm = document.getElementById("contactForm");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("navLinks");
const profileImage = document.querySelector(".portrait-img");
const formStatus = document.getElementById("formStatus");

// Hide the initials fallback only when the actual profile image loads.
if (profileImage) {
    profileImage.addEventListener("load", () => {
        const fallback = document.querySelector(".portrait-placeholder");
        if (fallback) fallback.hidden = true;
    });
    profileImage.addEventListener("error", () => {
        profileImage.hidden = true;
    });
    if (profileImage.complete && profileImage.naturalWidth > 0) {
        const fallback = document.querySelector(".portrait-placeholder");
        if (fallback) fallback.hidden = true;
    } else if (profileImage.complete && profileImage.naturalWidth === 0) {
        profileImage.hidden = true;
    }
}

// Accessible mobile navigation.
function closeMenu() {
    if (!menuToggle || !navLinks) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
        navLinks.classList.toggle("is-open", !isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) closeMenu();
    });
}

// Contact form: keep the existing Render API URL and field names.
if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!submitButton) return;
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        if (formStatus) {
            formStatus.textContent = "";
            formStatus.classList.remove("error");
        }

        try {
            const response = await fetch("https://krushnamanthalkar-developerportfolio.onrender.com/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, subject, message })
            });

            let data = {};
            try {
                data = await response.json();
            } catch {
                throw new Error("The server returned an unexpected response. Please try again.");
            }

            if (!response.ok) {
                throw new Error(data.message || "Failed to send message. Please try again.");
            }

            contactForm.reset();
            if (formStatus) {
                formStatus.textContent = data.message || "Thanks! Your message was sent successfully.";
                formStatus.classList.remove("error");
            } else {
                alert(data.message || "Message sent successfully!");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            const messageText = error.message || "Unable to connect to the server. Please try again.";
            if (formStatus) {
                formStatus.textContent = messageText;
                formStatus.classList.add("error");
            } else {
                alert(messageText);
            }
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message <span aria-hidden="true">↗</span>';
        }
    });
}