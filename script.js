// Fonction pour sauvegarder les listes
function sauvegarderListes(listes) {
    localStorage.setItem('listes', JSON.stringify(listes));
}

// Fonction pour récupérer les listes
function recupererListes() {
    return JSON.parse(localStorage.getItem('listes')) || [];
}

// Fonction pour ajouter une liste
function ajouterListe() {
    const nomListe = document.getElementById("nomListe").value;
    if (nomListe) {
        let listes = recupererListes();
        listes.push({ nom: nomListe, taches: [] });
        sauvegarderListes(listes);
        afficherListes();
        document.getElementById("nomListe").value = "";
    }
}

// Fonction pour afficher les listes
function afficherListes() {
    const listesContainer = document.getElementById("listes");
    listesContainer.innerHTML = '';
    const listes = recupererListes();
    
    listes.forEach((liste, index) => {
        const listeElement = document.createElement("li");
        listeElement.innerHTML = `
            <h3>${liste.nom}</h3>
            <button onclick="supprimerListe(${index})">Supprimer liste</button>
            <div>
                <input type="text" id="nouvelleTache${index}" placeholder="Nouvelle tâche">
                <button onclick="ajouterTache(${index})">Ajouter tâche</button>
            </div>
            <ul class="taches"></ul>
        `;
        
        const tachesUl = listeElement.querySelector('.taches');
        liste.taches.forEach((tache, tacheIndex) => {
            const tacheLi = document.createElement("li");
            tacheLi.innerHTML = `
                <input type="checkbox" ${tache.terminee ? 'checked' : ''} onchange="toggleTache(${index}, ${tacheIndex})">
                <span class="${tache.terminee ? 'terminee' : ''}">${tache.texte}</span>
                <button onclick="supprimerTache(${index}, ${tacheIndex})">Supprimer</button>
            `;
            tachesUl.appendChild(tacheLi);
        });
        
        listesContainer.appendChild(listeElement);
    });
}


// Fonction pour supprimer une liste
function supprimerListe(index) {
    let listes = recupererListes();
    listes.splice(index, 1);
    sauvegarderListes(listes);
    afficherListes();
}

// Fonction pour ajouter une tâche
function ajouterTache(listeIndex) {
    const inputTache = document.getElementById(`nouvelleTache${listeIndex}`);
    const nomTache = inputTache.value.trim();
    if (nomTache) {
        let listes = recupererListes();
        listes[listeIndex].taches.push({ texte: nomTache, terminee: false });
        sauvegarderListes(listes);
        afficherListes();
        inputTache.value = "";
    }
}

// Fonction pour supprimer une tâche
function supprimerTache(listeIndex, tacheIndex) {
    let listes = recupererListes();
    listes[listeIndex].taches.splice(tacheIndex, 1);
    sauvegarderListes(listes);
    afficherListes();
}

// Fonction pour marquer une tâche comme terminée ou non
function toggleTache(listeIndex, tacheIndex) {
    let listes = recupererListes();
    listes[listeIndex].taches[tacheIndex].terminee = !listes[listeIndex].taches[tacheIndex].terminee;
    sauvegarderListes(listes);
    afficherListes();
}
    
// Appeler cette fonction au chargement de la page
window.onload = afficherListes;
