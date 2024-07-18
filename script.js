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
            console.log("Tentative d'ajout de la liste:", nomListe);
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: nomListe, taches: [] }),
            });
            console.log("Réponse reçue:", response);
            if (!response.ok) throw new Error('Erreur lors de l\'ajout de la liste');
            const data = await response.json();
            console.log("Données reçues après ajout:", data);
            await afficherListes();
            document.getElementById("nomListe").value = "";
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
}
// fonction recuperer tache
async function recupererTaches(listeId) {
    try {
        const response = await fetch(`${API_URL}/tasks/${listeId}/taches`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des tâches');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

// Fonction pour afficher les listes
async function afficherListes() {
    const listesContainer = document.getElementById("listes");
    listesContainer.innerHTML = '';
    const listes = await recupererListes();
    console.log("Listes récupérées:", listes);

    if (!listes || !Array.isArray(listes)) {
        console.error("Les listes ne sont pas un tableau ou sont undefined:", listes);
        return;
    }

    for (const liste of listes) {
        const listeElement = document.createElement("li");
        listeElement.innerHTML = `
            <h3>${liste.title}</h3>
            <button onclick="supprimerListe(${liste.id})">Supprimer liste</button>
            <div class="newtache">
                <input type="text" id="nouvelleTache${liste.id}" placeholder="Nouvelle tâche">
                <button onclick="ajouterTache(${liste.id})">Ajouter tâche</button>
            </div>
            <ul class="taches"></ul>
        `;
        
        // Récupérer les tâches pour cette liste
        const taches = await recupererTaches(liste.id);
        console.log(`Tâches pour la liste ${liste.id}:`, taches);

        const tachesUl = listeElement.querySelector('.taches');
        taches.forEach((tache, tacheIndex) => {
            const tacheLi = document.createElement("li");
            tacheLi.innerHTML = `
                <input type="checkbox" ${tache.completed ? 'checked' : ''} onchange="toggleTache(${liste.id}, ${tacheIndex})">
                <span class="${tache.completed ? 'terminee' : ''}">${tache.title || 'Tâche sans nom'}</span>
                <button onclick="supprimerTache(${liste.id}, ${tacheIndex})">Supprimer</button>
            `;
            tachesUl.appendChild(tacheLi);
        });
        
        listesContainer.appendChild(listeElement);
    }
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
        console.log(`Tentative d'ajout de la tâche "${nomTache}" à la liste ${listeId}`);
        const response = await fetch(`${API_URL}/tasks/${listeId}/taches`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: nomTache, completed: false }),
        });
        console.log("Réponse reçue:", response);
        
        if (!response.ok) {
          let errorMessage;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || 'Erreur inconnue';
          } catch (e) {
            errorMessage = response.statusText;
          }
          throw new Error(`Erreur lors de l'ajout de la tâche: ${errorMessage}`);
        }
        
        const data = await response.json();
        console.log("Données reçues après ajout:", data);
        
        await afficherListes();
        inputTache.value = "";
      } catch (error) {
        console.error('Erreur détaillée:', error);
        alert(`Erreur lors de l'ajout de la tâche: ${error.message}`);
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
        const listes = await recupererListes();
        const liste = listes.find(l => l._id === listeId);
        const tache = liste.taches[tacheIndex];
        const nouvelEtat = !tache.terminee;

        const response = await fetch(`${API_URL}/tasks/${listeId}/taches/${tacheIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ terminee: nouvelEtat }),
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
