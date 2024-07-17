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
            <button onclick="supprimerListe(${liste._id})">Supprimer liste</button>
            <div class="newtache">
                <input type="text" id="nouvelleTache${liste._id}" placeholder="Nouvelle tâche">
                <button onclick="ajouterTache(${liste._id})">Ajouter tâche</button>
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
                    taches: { $push: { texte: nomTache, terminee: false }}
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
async function supprimerTache(listeId, tacheIndex) {
    try {
        const response = await fetch(`${API_URL}/tasks/${listeId}/taches/${tacheIndex}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erreur lors de la suppression de la tâche');
        await afficherListes();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour marquer une tâche comme terminée ou non
async function toggleTache(listeId, tacheIndex) {
    try {
        const response = await fetch(`${API_URL}/tasks/${listeId}/taches/${tacheIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ terminee: true }), // ou false, selon l'état actuel
        });
        if (!response.ok) throw new Error('Erreur lors de la mise à jour de la tâche');
        await afficherListes();
    } catch (error) {
        console.error('Erreur:', error);
    }
}
// Appeler cette fonction au chargement de la page
window.onload = async () => {
    await afficherListes();
};
