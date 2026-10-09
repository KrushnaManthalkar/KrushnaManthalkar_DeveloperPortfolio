const contactForm = document.getElementById("contactForm");
const submitButton = contactForm?.querySelector('button[type="submit"]');
const formStatus = document.getElementById("formStatus");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("navLinks");
const profileImage = document.querySelector(".portrait-img");
const yearElement = document.getElementById("year");

// Keep the initials fallback visible until a real profile photo is added.
if (profileImage) {
    profileImage.addEventListener("error", () => {
        profileImage.hidden = true;
    });
    if (profileImage.complete && profileImage.naturalWidth === 0) {
        profileImage.hidden = true;
    }
}

// Mobile navigation: close the menu after a section is selected.
function closeMenu() {
    if (!menuToggle || !navLinks) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
        navLinks.classList.toggle("is-open", !isOpen);
        document.body.classList.toggle("menu-open", !isOpen);
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

// Reveal content as it enters the viewport, with a reduced-motion fallback.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// Contact API: preserve the existing endpoint and payload structure.
if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!submitButton) return;

        const formData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            subject: document.getElementById("subject").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending… <span aria-hidden="true">↗</span>';
        if (formStatus) {
            formStatus.textContent = "";
            formStatus.classList.remove("error");
        }

        try {
            const response = await fetch("https://krushnamanthalkar-developerportfolio.onrender.com/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "We couldn't send your message. Please try again.");
            }

            contactForm.reset();
            if (formStatus) {
                formStatus.textContent = "Thanks! Your message was sent successfully.";
                formStatus.classList.remove("error");
            } else {
                alert("Message sent successfully!");
            }
        } catch (error) {
            console.error("Contact form error:", error);
            if (formStatus) {
                formStatus.textContent = error.message || "Unable to connect to the server. Please try again.";
                formStatus.classList.add("error");
            } else {
                alert(error.message || "Unable to connect to the server");
            }
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send message <span aria-hidden="true">↗</span>';
        }
    });
}