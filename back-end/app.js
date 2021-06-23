const express = require("express");
const cors = require("cors");
const mysql = require("mysql");


const app = express();
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Db_hobed",
});
connection.connect((error) => {
  {
    if (error) {
      console.log(
        `impossible de se connecter à la base de données suite à : ${error}`
      );
    }
    console.log("connexion avec la base de données établie");
  }
});

app.get("/database/apprenants", (req, res) => {
  connection.query("SELECT * FROM apprenants", (error, result) => {
    if (error) {
      res
        .status(500)
        .json({ message: "impossible d'accèder à la base de donnée" });
    }
    res.status(200).json(result);
  });
});
app.post("/database/apprenants", (req, res) => {
  const {
    nom_apprenant,
    mail_apprenant,
    address_apprenant,
    telephone_apprenant,
    id_cohorte,
  } = req.body;
  connection.query(
    "INSERT INTO apprenants (nom_apprenant, mail_apprenant,address_apprenant,telephone_apprenant,id_cohorte) VALUES (?,?,?,?,?)",
    [
      nom_apprenant,
      mail_apprenant,
      address_apprenant,
      telephone_apprenant,
      id_cohorte,
    ],
    (error, result) => {
      if (error) {
        res.send({
          message: "impossible d'insére les éléments à la base de donnée",
        });
      }
      res.send({ message: "Enregistrement effectué avec succès" });
    }
  );
});
app.put("/database/apprenants", (req, res) => {
  const {
    id_apprenant,
    nom_apprenant,
    mail_apprenant,
    address_apprenant,
    telephone_apprenant,
    id_cohorte,
  } = req.body;
  connection.query(
    "SELECT * FROM apprenants WHERE id_apprenant = ?",
    [id_apprenant],
    (error, result) => {
      if (error) {
        res.status(404).json({ message: "L'opération non aboutie" });
      }
      if (isObjectEmpty(result)) {
        res.status(404).json({ message: "L'apprenant non trouvé" });
      } else {
        connection.query(
          "UPDATE apprenants SET nom_apprenant = ? , mail_apprenant = ?,address_apprenant = ?,telephone_apprenant = ?,id_cohorte  = ? WHERE id_apprenant = ?",
          [
            nom_apprenant,
            mail_apprenant,
            address_apprenant,
            telephone_apprenant,
            id_cohorte,
            id_apprenant,
          ],
          (error, result) => {
            if (error) {
              res.status(404).json({ message: "L'opération non aboutie" });
            }
            res.status(200).json(result)
          }
        );
      }
    }
  );
});
app.delete("/database/apprenants", (req, res) => {
  const { id_apprenant } = req.body;
  connection.query(
    "SELECT * FROM apprenants WHERE id_apprenant = ?",
    [id_apprenant],
    (error, result) => {
      if (error) {
        res.status(404).json({ message: "L'opération non aboutie" });
      }
      if (isObjectEmpty(result)) {
        res.status(404).json({ message: "L'apprenant non trouvé" });
      } else {
        connection.query(
          "DELETE FROM apprenants WHERE id_apprenant = ?",[ id_apprenant],
          (error, result) => {
            if (error) {
              res.status(404).json({ message: `L'opération non aboutie : ${error}` });
            }
            res.status(200).json(result)
          }
        );
      }
    }
  );
});
//cohorte
app.get("/database/cohorte", (req, res) => {
  connection.query("SELECT * FROM cohorte", (error, result) => {
    if (error) {
      res
        .status(500)
        .json({ message: "impossible d'accèder à la base de donnée" });
    }
    res.status(200).json(result);
  });
});

app.post("/database/cohorte", (req, res) => {
  const {
    id_cohorte: id,
    nom_cohorte: nom,
    date_debut: da_d,
    date_fin: da_fin,
    nombre_apprenants: nbre,
  } = req.body;
  connection.query(
    "INSERT INTO cohorte (id_cohorte, nom_cohorte,	date_debut,	date_fin, nombre_apprenants	) VALUES (?,?,?,?,?)",
    [id, nom, da_d, da_fin, nbre],
    (error, result) => {
      if (error) {
        res.status(500).json({
          message: "impossible d'insére les éléments à la base de donnée",
        });
      }
      res.status(200).json({ message: "Enregistrement effectué avec succès" });
    }
  );
});

module.exports = app;
