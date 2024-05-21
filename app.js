import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

const app = express();

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "A1rnd2are3ps",
  database: "sistemadistribuido",
};

const connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to database", err);
    return;
  }
  console.log("Connection established");
});

app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT ?? 1234;

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/submit", (req, res) => {
  const {
    nombre,
    cedula,
    cargo,
    departamento,
    fechaVenta,
    descripcionVenta,
    totalVenta,
  } = req.body;

  const sql =
    "INSERT INTO Cliente (nombre, cedula, cargo, departamento) VALUES (?, ?, ?, ?)";
  connection.query(
    sql,
    [nombre, cedula, cargo, departamento],
    (err, result) => {
      if (err) {
        console.log("Error inserting into database", err);
        return;
      }

      const idCliente = result.insertId;

      const sqlVenta =
        "INSERT INTO Venta (FK_Id_cliente, fecha_de_la_venta, descripcion_de_la_venta, total_de_la_venta) VALUES (?, ?, ?, ?)";
      connection.query(
        sqlVenta,
        [idCliente, fechaVenta, descripcionVenta, totalVenta],
        (err, result) => {
          if (err) {
            console.log("Error inserting into database", err)
            return
          }
          res.send('<h1>Data insert correctly</h1>')
        }
      );
    }
  );
})

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
