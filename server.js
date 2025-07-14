// server.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const multer = require('multer');
 // const { use } = require('react'); Importante si requiere para utilizar 'react' descomentar esta linea
const app = express();
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'pet-matcher';
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Conexión a MongoDB
mongoose.connect('mongodb://host.docker.internal:27017/pet-matcher', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Conectado a MongoDB"))
.catch(err => console.error("Error de conexión:", err));
 
// Definir el modelo de usuario
const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Esquema de Mascota
const mascotaSchema = new mongoose.Schema({
  nombre: String,
  especie: String,
  raza: String,
  edad: Number,
  genero: String,
  descripcion: String,
  fotos: [String],
  ubicacion: {
    latitud: Number,
    longitud: Number,
  },
  busca: String, // "Amigos" o "Reproducción"
  likes: { type: Number, default: 0 } // Contador de "Me gusta"
});
const Mascota = mongoose.model('Mascota', mascotaSchema);

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Cambia a la carpeta donde quieras guardar las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre de archivo único
    }
});
const upload = multer({ storage: storage });

// Ruta para obtener todas las mascotas
app.get('/api/mascotas', async (req, res) => {
    try {
        const mascotas = await Mascota.find();
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las mascotas' });
    }
});

// Ruta para buscar mascotas
app.get('/api/mascotas_query', async (req, res) => {
    const { especie, raza, edad, genero, busca, likes } = req.query;

    const query = {};
    
    // Solo añadir al query los filtros que se hayan enviado
    if (especie) query.especie = especie;
    if (raza) query.raza = raza;
    if (edad) query.edad = edad;
    if (genero) query.genero = genero;
    if (busca) query.busca = busca;
    if (likes) query.likes = { $gte: Number(likes) }; // Mínimo de likes

    try {
        // Si no hay criterios de búsqueda, retornar todas las mascotas
        const mascotas = await Mascota.find(Object.keys(query).length ? query : {});
        res.json(mascotas);
    } catch (error) {
        console.error('Error al buscar mascotas:', error);
        res.status(500).json({ error: 'Error al buscar mascotas.' });
    }
});

// Ruta para crear una nueva mascota
app.post('/api/mascotas', upload.single('foto'), async (req, res) => {
    const nuevaMascota = new Mascota({
        nombre: req.body.nombre,
        especie: req.body.especie,
        raza: req.body.raza,
        edad: req.body.edad,
        genero: req.body.genero,
        descripcion: req.body.descripcion,
        busca: req.body.busca,
        fotos: [req.file.path] // Guarda la ruta de la imagen
    });

    try {
        await nuevaMascota.save();
        res.status(201).json(nuevaMascota);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar la mascota' });
    }
});

// Ruta para actualizar mascota, incluyendo nueva foto
app.put('/api/mascotas/:id', upload.single('foto'), async (req, res) => {
    const { id } = req.params;
    const { nombre, especie, raza, edad, genero, descripcion, busca } = req.body;

    try {
        const mascota = await Mascota.findById(id);
        if (!mascota) {
            return res.status(404).json({ error: 'Mascota no encontrada.' });
        }

        // Actualiza los datos básicos de la mascota
        mascota.nombre = nombre;
        mascota.especie = especie;
        mascota.raza = raza;
        mascota.edad = edad;
        mascota.genero = genero;
        mascota.descripcion = descripcion;
        mascota.busca = busca;

        // Si se subió una nueva foto, reemplaza la anterior
        if (req.file) {
            const fs = require('fs');
            if (mascota.fotos[0]) fs.unlinkSync(mascota.fotos[0]); // Elimina la foto anterior
            mascota.fotos[0] = req.file.path; // Guarda la nueva foto
        }

        await mascota.save();
        res.status(200).json({ message: 'Mascota actualizada correctamente.', mascota });
    } catch (error) {
        console.error('Error al actualizar la mascota:', error);
        res.status(500).json({ error: 'Error al actualizar la mascota.' });
    }
});

// Registro de usuario
app.post('/api/register', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ nombre, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el usuario' });
    }
});

// Login de usuario
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
        res.json({ message: 'Bienvenido', token });
    } catch (error) {
        res.status(400).json({ error: 'Error en el login' });
    }
});

// Ruta para incrementar "Me gusta"
app.post('/api/mascotas/:id/like', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Mascota.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { likes: 1 } }
        );

        if (result.modifiedCount === 1) {
            res.status(200).json({ message: 'Me gusta registrado.' });
        } else {
            res.status(404).json({ message: 'Mascota no encontrada.' });
        }
    } catch (error) {
        console.error('Error al incrementar los likes:', error);
        res.status(500).json({ message: 'Error al incrementar los likes.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
