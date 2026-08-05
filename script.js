"use strict";

const THEME_SPEICHERNAME = "felix-harren-theme";
const themeSchalter = document.querySelector(".theme-schalter");
const themeText = document.querySelector(".theme-text");
const themeSymbol = document.querySelector(".theme-symbol");
const favicon = document.querySelector("#favicon");
const appleTouchIcon = document.querySelector("#apple-touch-icon");
const themeColor = document.querySelector("#theme-color");
const systemFarbschema = window.matchMedia(
    "(prefers-color-scheme: dark)"
);

function gespeichertesDesignLesen() {
    try {
        const gespeichertesDesign =
            localStorage.getItem(THEME_SPEICHERNAME);

        if (
            gespeichertesDesign === "light" ||
            gespeichertesDesign === "dark"
        ) {
            return gespeichertesDesign;
        }
    } catch (fehler) {
        return null;
    }

    return null;
}

function systemDesignLesen() {
    return systemFarbschema.matches ? "dark" : "light";
}

function schalterBeschriftungAktualisieren(design) {
    if (!themeSchalter || !themeText || !themeSymbol) {
        return;
    }

    const istDunkel = design === "dark";

    themeText.textContent = istDunkel ? "Hell" : "Dunkel";
    themeSymbol.textContent = istDunkel ? "☀" : "☾";

    themeSchalter.setAttribute(
        "aria-label",
        istDunkel
            ? "Hellmodus aktivieren"
            : "Dunkelmodus aktivieren"
    );

    themeSchalter.setAttribute(
        "title",
        istDunkel
            ? "Zum Hellmodus wechseln"
            : "Zum Dunkelmodus wechseln"
    );
}


function seitensymboleAktualisieren(design) {
    const istDunkel = design === "dark";

    const faviconPfad = istDunkel
        ? "bilder/logo/favicon-dunkel.png"
        : "bilder/logo/favicon-hell.png";

    if (favicon) {
        favicon.href = faviconPfad;
    }

    if (appleTouchIcon) {
        appleTouchIcon.href = faviconPfad;
    }

    if (themeColor) {
        themeColor.content = istDunkel
            ? "#0c0c0c"
            : "#f5f5f2";
    }
}

function designAnwenden(design, speichern = false) {
    document.documentElement.dataset.theme = design;
    schalterBeschriftungAktualisieren(design);
    seitensymboleAktualisieren(design);

    if (speichern) {
        try {
            localStorage.setItem(
                THEME_SPEICHERNAME,
                design
            );
        } catch (fehler) {
            // Die Umschaltung funktioniert auch dann,
            // wenn der Browser das Speichern blockiert.
        }
    }
}

const startDesign =
    document.documentElement.dataset.theme ||
    gespeichertesDesignLesen() ||
    systemDesignLesen();

designAnwenden(startDesign);

if (themeSchalter) {
    themeSchalter.addEventListener("click", () => {
        const aktuellesDesign =
            document.documentElement.dataset.theme;

        const neuesDesign =
            aktuellesDesign === "dark"
                ? "light"
                : "dark";

        designAnwenden(neuesDesign, true);
    });
}

systemFarbschema.addEventListener("change", () => {
    if (!gespeichertesDesignLesen()) {
        designAnwenden(systemDesignLesen());
    }
});


/* ==================================================
   MOBILES MENÜ
   ================================================== */

const menuSchalter = document.querySelector(".menu-schalter");
const kopfMenue = document.querySelector("#kopf-menue");
const menueLinks = document.querySelectorAll(
    "#kopf-menue nav a"
);
const mobileGrenze = window.matchMedia("(max-width: 900px)");

function menueStatusSetzen(istOffen) {
    if (!menuSchalter || !kopfMenue) {
        return;
    }

    kopfMenue.classList.toggle("is-open", istOffen);
    menuSchalter.setAttribute(
        "aria-expanded",
        String(istOffen)
    );
    menuSchalter.setAttribute(
        "aria-label",
        istOffen ? "Menü schließen" : "Menü öffnen"
    );
}

if (menuSchalter && kopfMenue) {
    menuSchalter.addEventListener("click", () => {
        const istOffen =
            menuSchalter.getAttribute("aria-expanded") === "true";

        menueStatusSetzen(!istOffen);
    });

    menueLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (mobileGrenze.matches) {
                menueStatusSetzen(false);
            }
        });
    });

    document.addEventListener("keydown", (ereignis) => {
        if (ereignis.key === "Escape") {
            menueStatusSetzen(false);
            menuSchalter.focus();
        }
    });

    mobileGrenze.addEventListener("change", (ereignis) => {
        if (!ereignis.matches) {
            menueStatusSetzen(false);
        }
    });
}
