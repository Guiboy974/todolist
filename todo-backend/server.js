const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let tasks = []; // Ceci stockera nos listes
let nextId = 1;

// Route pour obtenir toutes les listes
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Route pour ajouter une nouvelle liste
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  const newList = { id: nextId++, title, taches: [] };
  tasks.push(newList);
  res.status(201).json(newList);
});

// Route pour ajouter une tâche à une liste
app.post('/tasks/:listeId/taches', (req, res) => {
  const { listeId } = req.params;
  const { title, completed = false } = req.body;
  
  const liste = tasks.find(t => t.id === parseInt(listeId));
  if (!liste) {
    return res.status(404).json({ message: "Liste non trouvée" });
  }
  
  const nouvelleTache = { id: nextId++, title, completed };
  liste.taches.push(nouvelleTache);
  
  res.status(201).json({ message: 'Tâche ajoutée avec succès', tache: nouvelleTache });
});

// Route pour mettre à jour une liste
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) {
    return res.status(404).json({ error: "Liste non trouvée" });
  }
  if (title !== undefined) task.title = title;
  res.json(task);
});

// Route pour supprimer une liste
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ error: "Liste non trouvée" });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

// Middleware 404 - à placer après toutes les autres routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint non trouvé' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});