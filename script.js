let metierCount = 0;

// Fonction pour ajouter un nouveau métier dans les paramètres généraux
function ajouterMetier() {
    metierCount++;
    const metierDiv = document.createElement("div");
    metierDiv.classList.add("metier");
    metierDiv.setAttribute("data-metier-id", metierCount);

    metierDiv.innerHTML = `
        <label>Nom du métier ${metierCount} :
            <input type="text" class="nomMetier" placeholder="Nom du métier ${metierCount}" required>
        </label>
        <button type="button" onclick="supprimerMetier(${metierCount})">Supprimer</button>
        <br>
    `;

    document.getElementById("metiersInputs").appendChild(metierDiv);
    // Ajouter automatiquement le champ de ce métier dans chaque entreprise
    document.querySelectorAll(".entreprise").forEach((entrepriseDiv) => {
        ajouterChampMetierEntreprise(entrepriseDiv, `Nom du métier ${metierCount}`);
    });
}

// Fonction pour ajouter des champs de métier dans chaque entreprise
function ajouterChampMetierEntreprise(entrepriseDiv, nomMetierPlaceholder) {
    const metierDiv = document.createElement("div");
    metierDiv.classList.add("metierEntreprise");

    metierDiv.innerHTML = `
        <label>${nomMetierPlaceholder} :
            <input type="number" class="nbEmployesMetier" value="0">
        </label>
        <br>
    `;
    entrepriseDiv.appendChild(metierDiv);
}

// Fonction pour ajouter une nouvelle entreprise
function ajouterEntreprise() {
    const entrepriseDiv = document.createElement("div");
    entrepriseDiv.classList.add("entreprise");

    const entrepriseCount = document.querySelectorAll('.entreprise').length + 1;
    entrepriseDiv.innerHTML = `
        <h3>Entreprise ${entrepriseCount}</h3>
        <label>Nom de l'entreprise :
            <input type="text" class="nomEntreprise" placeholder="Nom de l'entreprise ${entrepriseCount}">
        </label>
        <br>
    `;

    // Ajouter les champs de chaque métier déjà défini
    document.querySelectorAll(".nomMetier").forEach((metierInput) => {
        const nomMetier = metierInput.value || metierInput.placeholder;
        ajouterChampMetierEntreprise(entrepriseDiv, nomMetier);
    });

    document.getElementById("entreprisesInputs").appendChild(entrepriseDiv);
}

// Fonction pour supprimer un métier des paramètres généraux et des entreprises
function supprimerMetier(metierId) {
    document.querySelector(`.metier[data-metier-id="${metierId}"]`).remove();
    document.querySelectorAll(`.metierEntreprise[data-metier-id="${metierId}"]`).forEach((element) => element.remove());
}

// Fonction pour calculer les proportions
function calculerProportions() {
    const nbReponsesTotal = parseInt(document.getElementById("nbReponsesTotal").value);
    const ratioHommes = parseInt(document.getElementById("ratioHommes").value);
    const ratioFemmes = parseInt(document.getElementById("ratioFemmes").value);
    const autoDistribuer = document.getElementById("autoDistribuer").checked;
    const totalRatio = ratioHommes + ratioFemmes;

    // Récupérer les métiers à analyser
    const metiers = Array.from(document.querySelectorAll(".nomMetier")).map((input) => input.value || input.placeholder);

    // Récupérer les données des entreprises
    const entreprises = [];
    document.querySelectorAll('.entreprise').forEach((div) => {
        const nom = div.querySelector(".nomEntreprise").value || "Entreprise";

        const employesParMetier = Array.from(div.querySelectorAll(".nbEmployesMetier")).map((input, index) => ({
            nom: metiers[index],
            nombre: parseInt(input.value),
        }));

        entreprises.push({ nom, employesParMetier });
    });

    const totalEmployes = entreprises.reduce((total, entreprise) => total + entreprise.employesParMetier.reduce((somme, metier) => somme + metier.nombre, 0), 0);

    // Effacer les résultats précédents
    document.getElementById("resultats").innerHTML = "";

    entreprises.forEach((entreprise) => {
        let nbReponsesParEntreprise;
        if (autoDistribuer) {
            const employesEntreprise = entreprise.employesParMetier.reduce((somme, metier) => somme + metier.nombre, 0);
            nbReponsesParEntreprise = Math.round(nbReponsesTotal * (employesEntreprise / totalEmployes));
        } else {
            nbReponsesParEntreprise = parseInt(document.getElementById("nbReponsesParEntreprise").value);
        }

        document.getElementById("resultats").innerHTML += `<h3>${entreprise.nom}</h3><p>Nombre total de réponses pour cette entreprise: ${nbReponsesParEntreprise}</p><ul>`;

        entreprise.employesParMetier.forEach((metier) => {
            const proportion = metier.nombre / totalEmployes;
            let nbMetier = nbReponsesParEntreprise * proportion;
            let nbHommesMetier = Math.floor(nbMetier * (ratioHommes / totalRatio));
            let nbFemmesMetier = Math.floor(nbMetier * (ratioFemmes / totalRatio));

            document.getElementById("resultats").innerHTML += `
                <li>${metier.nom} Hommes: ${nbHommesMetier}</li>
                <li>${metier.nom} Femmes: ${nbFemmesMetier}</li>
            `;
        });

        document.getElementById("resultats").innerHTML += "</ul>";
    });
}

// Affiche ou masque le champ de réponses par entreprise selon la case cochée
document.getElementById("autoDistribuer").addEventListener("change", function() {
    document.getElementById("reponsesParEntrepriseLabel").style.display = this.checked ? "none" : "block";
});
