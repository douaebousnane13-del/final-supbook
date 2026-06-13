import { useState } from "react";

function useNotification() {
      const [succes, setSucces] = useState("");
    const [erreur, setErreur] = useState("");

  function afficherSucces(msg) {
       setSucces(msg);
       setTimeout(() => setSucces(""), 3000);
  }

      function afficherErreur(msg) {
setErreur(msg);
         setTimeout(() => setErreur(""), 3000);
  }
    
             return { succes, erreur, afficherSucces, afficherErreur };
}

export default useNotification;
