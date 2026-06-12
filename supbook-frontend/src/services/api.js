const API_URL = "http://localhost:1337/api";

function getToken() {
  return localStorage.getItem("token");
}


   
async function request(path, options = {}) {
     const headers = {};
if (options.body) headers["Content-Type"] = "application/json";
    const token = getToken();
    if (token) headers["Authorization"] = "Bearer " + token;

    
    
    try {
     const response = await fetch(API_URL + path, {
       method: options.method || "GET",
    headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });


      if (!response.ok) {
      return { erreur: options.messageErreur || "Une erreur est survenue" };
       }
       if (response.status === 204) return {}; 
      return await response.json();
  } catch (err) {
    return { erreur: "Serveur inaccessible, réessaye plus tard" };
  }
}

   
function inscrire(nom, email, motDePasse) {
     return request("/auth/local/register", {
        method: "POST",
    body: { username: nom, email, password: motDePasse },
    messageErreur: "Erreur lors de l'inscription",
  });
}

  
function connecter(email, motDePasse) {
    
  return request("/auth/local", {
      method: "POST",
    body: { identifier: email, password: motDePasse },
    messageErreur: "Email ou mot de passe incorrect",
  });
}

function getLivres() {
    return request(
   "/livres?populate=auteur&populate=collections&populate=users_permissions_user",
    { messageErreur: "Impossible de charger les livres" }
  );
}

function ajouterLivre(livre) {
     return request("/livres", {
   method: "POST",
body: { data: livre },
      messageErreur: "Impossible d'ajouter le livre",
  });
}


function modifierLivre(documentId, donnees) {
  return request("/livres/" + documentId, {
     method: "PUT",
    body: { data: donnees },
    messageErreur: "Impossible de modifier le livre",
  });
}

   
   function supprimerLivre(documentId) {
  return request("/livres/" + documentId, {
    method: "DELETE",
    messageErreur: "Impossible de supprimer le livre",
  });
}

function retirerLivreCollection(livreDocumentId, collections) {
  return modifierLivre(livreDocumentId, { collections });
}

function getAuteurs() {
  return request("/auteurs");
}

function ajouterAuteur(nom, prenom) {
  return request("/auteurs", {
    method: "POST",
    body: { data: { nom, prenom } },
  });
}

function supprimerAuteur(documentId) {
  return request("/auteurs/" + documentId, { method: "DELETE" });
}

function getCollections() {
  return request("/collections");
}

function ajouterCollection(nom) {
  return request("/collections", {
    method: "POST",
    body: { data: { nom } },
  });
}

function supprimerCollection(documentId) {
  return request("/collections/" + documentId, { method: "DELETE" });
}

export {
  getToken,
  inscrire,
  connecter,
  getLivres,
  ajouterLivre,
  modifierLivre,
  supprimerLivre,
  retirerLivreCollection,
  getAuteurs,
  ajouterAuteur,
  supprimerAuteur,
  getCollections,
  ajouterCollection,
  supprimerCollection,
};
