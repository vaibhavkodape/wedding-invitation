// ======================================
// PROJECT SAPTAPADI — PAGE CONTENT
// Reads all wedding details from config.js
// ======================================
/* ==========================================
   Theme Engine
========================================== */

if (typeof WeddingConfig !== "undefined" && WeddingConfig.theme) {

    document.body.classList.add(
        "theme-" + WeddingConfig.theme
    );

}
function setText(id, text) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = text;
    }
}

function setLink(id, url) {
    const element = document.getElementById(id);

    if (element) {
        element.href = url;
    }
}

function updateCountdown() {
    const weddingMoment = new Date(WeddingConfig.weddingDateTime).getTime();
    const currentMoment = new Date().getTime();
    const remainingTime = weddingMoment - currentMoment;

    if (remainingTime <= 0) {
        setText("countDays", "00");
        setText("countHours", "00");
        setText("countMinutes", "00");
        setText("countSeconds", "00");
        return;
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    setText("countDays", String(days).padStart(2, "0"));
    setText("countHours", String(hours).padStart(2, "0"));
    setText("countMinutes", String(minutes).padStart(2, "0"));
    setText("countSeconds", String(seconds).padStart(2, "0"));
}

function openLightbox(imageSource, imageDescription) {
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    lightboxImage.src = imageSource;
    lightboxImage.alt = imageDescription;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
}

function closeLightbox() {
    const lightbox = document.getElementById("galleryLightbox");

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
}

// Opening screen
setText("blessing", WeddingConfig.blessing);
setText("brideName", WeddingConfig.brideName);
setText("groomName", WeddingConfig.groomName);

setText(
    "weddingInfo",
    `${WeddingConfig.weddingDate} • ${WeddingConfig.weddingCity}`
);

// Wedding-day screen
setText("weddingDay", WeddingConfig.weddingDay);
setText("weddingMonth", WeddingConfig.weddingMonth);
setText("weddingYear", WeddingConfig.weddingYear);

setText(
    "weddingLocation",
    `${WeddingConfig.weddingCity}, ${WeddingConfig.weddingState}`
);

// Venue screen
setText("venueName", WeddingConfig.venueName);
setText("venueAddress", WeddingConfig.venueAddress);
setText("weddingTime", WeddingConfig.weddingTime);
setLink("mapsLink", WeddingConfig.googleMapsLink);

// RSVP screen
setText("rsvpName", WeddingConfig.rsvpName);
setText("rsvpPhone", WeddingConfig.rsvpPhone);
const whatsappUrl =
    "https://wa.me/" +
    WeddingConfig.rsvpPhone +
    "?text=" +
    encodeURIComponent(WeddingConfig.rsvpMessage);

setLink("rsvpWhatsAppLink", whatsappUrl);

// Countdown
updateCountdown();
setInterval(updateCountdown, 1000);

// Gallery fullscreen view
document.querySelectorAll(".gallery-card").forEach((card) => {
    card.addEventListener("click", () => {
        openLightbox(card.dataset.image, card.dataset.alt);
    });
});

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);

document.getElementById("galleryLightbox").addEventListener("click", (event) => {
    if (event.target.id === "galleryLightbox") {
        closeLightbox();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeLightbox();
    }
});


// Cinematic scroll reveals
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.16
    }
);

const motionItems = document.querySelectorAll(
    ".saptapadi-intro .section-inner, " +
    ".celebration-inner, " +
    ".countdown-inner, " +
    ".gallery-heading, " +
    ".gallery-grid, " +
    ".venue-inner, " +
    ".rsvp-inner"
);

motionItems.forEach((item) => {
    item.classList.add("motion-layer");
    revealObserver.observe(item);
});

document.querySelectorAll("main > section:not(.hero)").forEach((section) => {
    section.classList.add("reveal-section");
    revealObserver.observe(section);
});


// Background music
const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

musicToggle.addEventListener("click", async () => {
    if (backgroundMusic.paused) {
        try {
            await backgroundMusic.play();
            musicLabel.textContent = "Pause music";
            musicToggle.classList.add("is-playing");
            musicToggle.setAttribute("aria-label", "Pause background music");
        } catch {
            musicLabel.textContent = "Tap to play";
        }
    } else {
        backgroundMusic.pause();
        musicLabel.textContent = "Play music";
        musicToggle.classList.remove("is-playing");
        musicToggle.setAttribute("aria-label", "Play background music");
    }
});

// Add wedding to calendar
function calendarDate(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function calendarText(text) {
    return text.replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

document.getElementById("calendarButton").addEventListener("click", () => {
    const startTime = new Date(WeddingConfig.weddingDateTime);
    const endTime = new Date(startTime.getTime() + 4 * 60 * 60 * 1000);

    const eventTitle = `${WeddingConfig.brideName} & ${WeddingConfig.groomName} Wedding`;
    const eventLocation = `${WeddingConfig.venueName}, ${WeddingConfig.venueAddress}`;

    const calendarFile = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `DTSTART:${calendarDate(startTime)}`,
        `DTEND:${calendarDate(endTime)}`,
        `SUMMARY:${calendarText(eventTitle)}`,
        `LOCATION:${calendarText(eventLocation)}`,
        "DESCRIPTION:We warmly invite you to celebrate our wedding.",
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const file = new Blob([calendarFile], {
        type: "text/calendar;charset=utf-8"
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(file);
    downloadLink.download = "vrundika-vaibhav-wedding.ics";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(downloadLink.href);
});


// Hero depth while scrolling
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".hero-content");
    let animationFrame;

    function updateHeroDepth() {
        const progress = Math.min(window.scrollY / window.innerHeight, 1);

        hero.style.backgroundPosition = `center ${50 + progress * 5}%`;
        heroContent.style.transform = `translate3d(0, ${progress * 42}px, 0)`;
        heroContent.style.opacity = String(1 - progress * 0.72);

        animationFrame = null;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!animationFrame) {
                animationFrame = requestAnimationFrame(updateHeroDepth);
            }
        },
        { passive: true }
    );

    updateHeroDepth();
}

// Editorial gallery drift
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const galleryImages = document.querySelectorAll(".gallery-card img");
    let galleryAnimationFrame;

    function updateGalleryDrift() {
        const viewportMiddle = window.innerHeight / 2;

        galleryImages.forEach((image, index) => {
            const imageMiddle = image.getBoundingClientRect().top +
                image.getBoundingClientRect().height / 2;

            const distance = imageMiddle - viewportMiddle;
            const drift = Math.max(-16, Math.min(16, distance * -0.035));
            const direction = index === 1 ? -1 : 1;

            image.style.setProperty(
                "--gallery-drift",
                `${drift * direction}px`
            );
        });

        galleryAnimationFrame = null;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!galleryAnimationFrame) {
                galleryAnimationFrame = requestAnimationFrame(updateGalleryDrift);
            }
        },
        { passive: true }
    );

    updateGalleryDrift();
}

// Invitation journey progress rail
const storySections = Array.from(document.querySelectorAll("main > section"));
const storyLabels = [
    "Opening",
    "Saptapadi",
    "Wedding date",
    "Countdown",
    "Gallery",
    "Venue",
    "RSVP"
];

const storyProgress = document.createElement("nav");
storyProgress.className = "story-progress";
storyProgress.setAttribute("aria-label", "Invitation journey");

const storyDots = storySections.map((section, index) => {
    const dot = document.createElement("button");

    dot.className = "story-progress-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to ${storyLabels[index]}`);

    dot.addEventListener("click", () => {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    storyProgress.appendChild(dot);
    return dot;
});

document.body.appendChild(storyProgress);

const storyObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const activeIndex = storySections.indexOf(entry.target);

                storyDots.forEach((dot) => {
                    dot.classList.remove("is-active");
                });

                storyDots[activeIndex].classList.add("is-active");
            }
        });
    },
    {
        threshold: 0.5
    }
);

storySections.forEach((section) => {
    storyObserver.observe(section);
});


