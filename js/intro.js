document.addEventListener("DOMContentLoaded", function () {

    const introScreen = document.getElementById("introScreen");
    const openInvitation = document.getElementById("openInvitation");

    if (!introScreen || !openInvitation) {
        return;
    }

    document.body.style.overflow = "hidden";

    openInvitation.addEventListener("click", function () {

        introScreen.classList.add("is-opening");

        setTimeout(function () {

            introScreen.classList.add("is-open");

            document.body.style.overflow = "";

        }, 1250);

        const music = document.getElementById("backgroundMusic");

        if (music) {
            music.play().catch(function () {});
        }

        const label = document.getElementById("musicLabel");

        if (label) {
            label.textContent = "Pause music";
        }

        const toggle = document.getElementById("musicToggle");

        if (toggle) {
            toggle.setAttribute(
                "aria-label",
                "Pause background music"
            );
        }

    });

});