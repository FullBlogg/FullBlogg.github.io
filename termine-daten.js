"use strict";

/*
    HIER PFLEGST DU DEINE TERMINE.

    Einen neuen Termin fügst du hinzu, indem du einen vorhandenen
    Block vollständig kopierst und die Angaben veränderst.

    Das Datum wird im Format Jahr-Monat-Tag geschrieben:
    2026-09-20

    Der Link darf leer bleiben:
    link: ""
*/

const termine = [
    /*
        Hier später echte Termine eintragen.

        Beispiel:

        {
            datum: "2026-09-20",
            uhrzeit: "17:00",
            titel: "Orgelkonzert",
            ort: "Name und Ort der Kirche",
            beschreibung:
                "Kurze Beschreibung des Programms.",
            link: ""
        }
    */
];

const terminListe = document.querySelector("#termin-liste");
const keineTermineHinweis = document.querySelector("#keine-termine");

const startTerminListe = document.querySelector(
    "#start-termin-liste"
);
const keineStartTermineHinweis = document.querySelector(
    "#keine-start-termine"
);

function datumUmwandeln(datum) {
    return new Date(`${datum}T12:00:00`);
}

function datumFormatieren(datum) {
    return new Intl.DateTimeFormat("de-DE", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(datumUmwandeln(datum));
}

function kommendeTermineErmitteln() {
    const heute = new Date();

    heute.setHours(0, 0, 0, 0);

    return termine
        .filter((termin) => {
            return datumUmwandeln(termin.datum) >= heute;
        })
        .sort((terminA, terminB) => {
            return (
                datumUmwandeln(terminA.datum) -
                datumUmwandeln(terminB.datum)
            );
        });
}

function terminErstellen(termin) {
    const artikel = document.createElement("article");

    artikel.classList.add("termin-karte");

    const datum = document.createElement("p");

    datum.classList.add("termin-datum");
    datum.textContent = datumFormatieren(termin.datum);

    const titel = document.createElement("h3");

    titel.textContent = termin.titel;

    const details = document.createElement("p");

    details.classList.add("termin-details");
    details.textContent =
        `${termin.uhrzeit} Uhr · ${termin.ort}`;

    const beschreibung = document.createElement("p");

    beschreibung.textContent = termin.beschreibung;

    artikel.append(
        datum,
        titel,
        details,
        beschreibung
    );

    if (termin.link) {
        const link = document.createElement("a");

        link.href = termin.link;
        link.textContent = "Weitere Informationen";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        artikel.append(link);
    }

    return artikel;
}

function terminListeFuellen(
    zielElement,
    anzuzeigendeTermine,
    leerHinweis
) {
    if (!zielElement) {
        return;
    }

    zielElement.replaceChildren();

    if (anzuzeigendeTermine.length === 0) {
        if (leerHinweis) {
            leerHinweis.hidden = false;
        }

        return;
    }

    if (leerHinweis) {
        leerHinweis.hidden = true;
    }

    anzuzeigendeTermine.forEach((termin) => {
        zielElement.append(
            terminErstellen(termin)
        );
    });
}

function termineAnzeigen() {
    const kommendeTermine =
        kommendeTermineErmitteln();

    terminListeFuellen(
        terminListe,
        kommendeTermine,
        keineTermineHinweis
    );

    terminListeFuellen(
        startTerminListe,
        kommendeTermine.slice(0, 3),
        keineStartTermineHinweis
    );
}

termineAnzeigen();
