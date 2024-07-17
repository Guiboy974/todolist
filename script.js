// URL de base de votre API
const API_URL = 'http://localhost:3000';

// Fonction pour récupérer les listes
async function recupererListes() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des listes');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

// Fonction pour ajouter une liste
async function ajouterListe() {
    const nomListe = document.getElementById("nomListe").value;
    if (nomListe) {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: nomListe, taches: [] }),
            });
            if (!response.ok) throw new Error('Erreur lors de l\'ajout de la liste');
            await afficherListes();
            document.getElementById("nomListe").value = "";
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
}


// Fonction pour afficher les listes
async function afficherListes() {
    const listesContainer = document.getElementById("listes");
    listesContainer.innerHTML = '';
    const listes = await recupererListes();
    
    listes.forEach((liste) => {
        const listeElement = document.createElement("li");
        listeElement.innerHTML = `
            <h3>${liste.nom}</h3>
            <button onclick="supprimerListe(${index})">Supprimer liste</button>
            <div class="newtache">
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

// fonction pour supprimer une liste
async function supprimerListe(id) {
    try {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erreur lors de la suppression de la liste');
        await afficherListes();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour ajouter une tâche
async function ajouterTache(listeId) {
    const inputTache = document.getElementById(`nouvelleTache${listeId}`);
    const nomTache = inputTache.value.trim();
    if (nomTache) {
        try {
            const response = await fetch(`${API_URL}/tasks/${listeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taches: [...listes[listeId].taches, { texte: nomTache, terminee: false }]
                }),
            });
            if (!response.ok) throw new Error('Erreur lors de l\'ajout de la tâche');
            await afficherListes();
            inputTache.value = "";
        } catch (error) {
            console.error('Erreur:', error);
        }
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
window.onload = async () => {
    await afficherListes();
};
