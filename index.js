const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const server = express();
server.use(express.static("dist"));
server.use(express.json());
morgan.token("content", function getContent(req) {
  return JSON.stringify(req.body);
});
server.use(cors());
server.use(morgan(":method :url :status :response-time ms :content"));
let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: "5",
    name: "Mary pop-my-dick",
    number: "69-69-696969",
  },
];

const date = new Date();
const body = `
<div>Phonebook has info for ${persons.length} persons</div>
<br>
<div>${date.toString()}</div>
`;
const generateID = () => {
  const rand = Math.floor(Math.random() * 100000 + 5);
  return rand;
};

server.get("/", (req, res) => {
  res.send("<div>Hello from express</div>");
});

server.get("/api/persons", (req, res) => {
  res.json(persons);
});

server.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((entry) => entry.id === id);
  if (person) {
    res.json(person);
  } else {
    res.statusMessage = "Person not found in the phonebook";
    res.status(404).end();
  }
});

server.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.filter((entry) => entry.id !== id);
  if (person) {
    res.json(person);
  } else {
    res.statusMessage = "Person not found in the phonebook";
    res.status(204).end();
  }
});
server.post("/api/persons", (req, res) => {
  const body = req.body;
  const id = generateID();
  const test = persons.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  );
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }
  if (test) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    id: id,
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  res.json(persons);
});

server.get("/api/info", (req, res) => {
  res.send(body);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`listening on Port: ${PORT}`);
});
