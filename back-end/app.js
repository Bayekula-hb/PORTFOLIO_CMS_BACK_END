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
    } else {
      console.log("connexion avec la base de données établie");
    }
  }
});

app.get("/api/projects", (req, res) => {
  connection.query("SELECT * FROM projects", (error, result) => {
    if (error) {
      res
        .status(500)
        .json({ message: "impossible d'accèder à la base de donnée" });
    }
    res.status(200).json(result);
  });
});

app.post("/api/projects", (req, res) => {
  const {
    name_project,
    description_project,
    link_gitHub_project,
    link_NetliFy_project,
    picture_project,
  } = req.body;
  connection.query(
    "INSERT INTO projects (name_projects, description_projects, link_github,	link_netlify,	picture	) VALUES (?,?,?,?,?)",
    [
      name_project,
      description_project,
      link_gitHub_project,
      link_NetliFy_project,
      picture_project,
    ],
    (error, result) => {
      if (error) {
        res.send({
          message: "impossible d'insére l'élément à la base de donnée",
        });
      }
      console.log(`${result} : resultat`);
      res.send({ message: "Enregistrement effectué avec succès" });
    }
  );
});

app.put("/api/projects", (req, res) => {
  const {
    id_apprenant,
    nom_apprenant,
    mail_apprenant,
    address_apprenant,
    telephone_apprenant,
    id_cohorte,
  } = req.body;
  connection.query(
    "SELECT * FROM projects WHERE id_apprenant = ?",
    [id_apprenant],
    (error, result) => {
      if (error) {
        res.status(404).json({ message: "L'opération non aboutie" });
      }
      if (isObjectEmpty(result)) {
        res.status(404).json({ message: "L'apprenant non trouvé" });
      } else {
        connection.query(
          "UPDATE projects SET nom_apprenant = ? , mail_apprenant = ?,address_apprenant = ?,telephone_apprenant = ?,id_cohorte  = ? WHERE id_apprenant = ?",
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
            res.status(200).json(result);
          }
        );
      }
    }
  );
});

app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM projects WHERE id_projects = ?",
    [id],
    (error, result) => {
      if (error) {
        res.status(404).json({ message: "L'opération non aboutie" });
      }
      // if (isObjectEmpty(result)) {
      //   res.status(404).json({ message: "Aucun projet trouver" });
      // } else {
      connection.query(
        "DELETE FROM projects WHERE id_projects = ?",
        [id],
        (error, result) => {
          if (error) {
            res
              .status(404)
              .json({ message: `L'opération non aboutie : ${error}` });
          }
          res.status(200).json(result);
        }
      );
      // }
    }
  );
});

module.exports = app;
