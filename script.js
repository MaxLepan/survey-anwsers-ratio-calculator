let metierCount = 0;

// Fonction pour ajouter un nouveau métier dans les paramètres généraux
function ajouterMetier() {
    metierCount++;
    const metierDiv = document.createElement("div");
    metierDiv.classList.add("metier");
    metierDiv.setAttribute("data-metier-id", metierCount);

    metierDiv.innerHTML = `
        <div class="containerMetier">
        <label>
            <input type="text" class="nomMetier" placeholder="Job ${metierCount} name" required>
        </label>
        <button type="button" onclick="supprimerMetier(${metierCount})">Delete</button>
        </div>
        <br>
    `;

    document.getElementById("metiersInputs").appendChild(metierDiv);
    // Ajouter automatiquement le champ de ce métier dans chaque entreprise
    document.querySelectorAll(".entreprise").forEach((entrepriseDiv) => {
        ajouterChampMetierEntreprise(entrepriseDiv, `Job ${metierCount}`);
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
        <h3>Company ${entrepriseCount}</h3>
        <label>Company name :
            <input type="text" class="nomEntreprise" placeholder="Company ${entrepriseCount} name">
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

// Fonction pour afficher/masquer les options de distribution
function toggleDistributionOptions() {
    const autoDistribuer = document.getElementById("autoDistribuer").checked;
    document.getElementById("distributionOptions").style.display = autoDistribuer ? "block" : "none";
    document.getElementById("reponsesParEntrepriseLabel").style.display = autoDistribuer ? "none" : "block";
}

// Fonction pour calculer les proportions
function calculerProportions() {
    const nbReponsesTotal = parseInt(document.getElementById("nbReponsesTotal").value);
    const ratioHommes = parseInt(document.getElementById("ratioHommes").value);
    const ratioFemmes = parseInt(document.getElementById("ratioFemmes").value);
    const autoDistribuer = document.getElementById("autoDistribuer").checked;
    const distributionEqually = document.getElementById("distributionEqually").checked;
    const totalRatio = ratioHommes + ratioFemmes;

    const metiers = Array.from(document.querySelectorAll(".nomMetier")).map((input) => input.value || input.placeholder);

    const entreprises = [];
    document.querySelectorAll('.entreprise').forEach((div) => {
        const nom = div.querySelector(".nomEntreprise").value || "Company";

        const employesParMetier = Array.from(div.querySelectorAll(".nbEmployesMetier")).map((input, index) => ({
            nom: metiers[index],
            nombre: parseInt(input.value),
        }));

        entreprises.push({ nom, employesParMetier });
    });

    const totalEmployes = entreprises.reduce((total, entreprise) => 
        total + entreprise.employesParMetier.reduce((somme, metier) => somme + metier.nombre, 0), 0);

    document.getElementById("resultats").innerHTML = "";

    entreprises.forEach((entreprise) => {
        let nbReponsesParEntreprise;
        if (autoDistribuer) {
            if (distributionEqually) {
                nbReponsesParEntreprise = Math.floor(nbReponsesTotal / entreprises.length);
            } else {
                const employesEntreprise = entreprise.employesParMetier.reduce((somme, metier) => somme + metier.nombre, 0);
                nbReponsesParEntreprise = Math.round(nbReponsesTotal * (employesEntreprise / totalEmployes));
            }
        } else {
            nbReponsesParEntreprise = parseInt(document.getElementById("nbReponsesParEntreprise").value);
        }

        let resultHTML = `<div class="result-item"><h3>${entreprise.nom}</h3>`;
        resultHTML += `<p>Total number of responses for this company: ${nbReponsesParEntreprise}</p><ul>`;

        entreprise.employesParMetier.forEach((metier) => {
            const proportionMetier = metier.nombre / entreprise.employesParMetier.reduce((somme, m) => somme + m.nombre, 0);
            let nbMetier = nbReponsesParEntreprise * proportionMetier;
            let nbHommesMetier = Math.floor(nbMetier * (ratioHommes / totalRatio));
            let nbFemmesMetier = Math.floor(nbMetier * (ratioFemmes / totalRatio));

            let totalAssigned = nbHommesMetier + nbFemmesMetier;
            if (totalAssigned < nbMetier) {
                if ((nbMetier * (ratioHommes / totalRatio)) % 1 > (nbMetier * (ratioFemmes / totalRatio)) % 1) {
                    nbHommesMetier += nbMetier - totalAssigned;
                } else {
                    nbFemmesMetier += nbMetier - totalAssigned;
                }
            }

            resultHTML += `
                <li>${metier.nom} - Men: ${Math.round(nbHommesMetier)}</li>
                <li>${metier.nom} - Women: ${Math.round(nbFemmesMetier)}</li>
            `;
        });

        resultHTML += "</ul></div>";
        document.getElementById("resultats").innerHTML += resultHTML;
    });
}



// Affiche ou masque le champ de réponses par entreprise selon la case cochée
document.getElementById("autoDistribuer").addEventListener("change", toggleDistributionOptions);
