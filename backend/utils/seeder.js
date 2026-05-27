const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Product = require('../models/Product');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Job = require('../models/Job');

/**
 * SEMBRADOR CENTRAL DE DATOS (SEEDER) - VERSIÓN MASIVA (200 EMPLEOS)
 */

const seedDatabase = async () => {
  try {
    console.log('Iniciando proceso de seeding...');

    // 1. Usuarios Ficticios
    const authors = [
      { nombre: 'Agustin S.', email: 'agustin@devvia.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agustin' },
      { nombre: 'Elena R.', email: 'elena@devvia.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
      { nombre: 'Marcus T.', email: 'marcus@devvia.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' }
    ];

    for (const authData of authors) {
      const exists = await User.findOne({ email: authData.email });
      if (!exists) await User.create({ ...authData, password: 'password123' });
    }

    const admin = await User.findOne({ email: 'admin@devvia.com' }) || await User.create({ nombre: 'Admin', email: 'admin@devvia.com', password: 'password123' });
    const agustin = await User.findOne({ email: 'agustin@devvia.com' });
    const elena = await User.findOne({ email: 'elena@devvia.com' });

    // 2. Proyectos (Repositorios)
    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      await Project.create([
        {
          nombre: "Project-Star",
          descripcion: "Motor 3D ligero para visualizaciones WebGL.",
          tags: ["WebGL", "Three.js"],
          lenguaje: "JavaScript",
          usuario: agustin._id,
          publico: true,
          stars: 1240,
          archivos: [{ nombre: "README.md", contenido: "# Star", ruta: "" }]
        },
        {
          nombre: "GlassyUI",
          descripcion: "Librería de componentes con efecto Glassmorphism.",
          tags: ["React", "UI-UX"],
          lenguaje: "TypeScript",
          usuario: elena._id,
          publico: true,
          stars: 3420,
          archivos: [{ nombre: "Button.tsx", contenido: "export const Button...", ruta: "src" }]
        }
      ]);
      console.log('Proyectos sembrados.');
    }

    // 3. Foro (Posts y Comentarios)
    // Limpiamos para evitar duplicados por re-intentos de seeding
    await Post.deleteMany({});
    await Comment.deleteMany({});

    const postsData = [
      {
        title: "¿Cuál es el mejor stack para 2026?",
        content: "Hola a todos, estoy empezando un nuevo proyecto y me gustaría saber sus opiniones sobre qué tecnologías dominarán este año. ¿Sigue siendo React + Node la mejor opción?",
        author: agustin._id,
        authorName: agustin.nombre,
        tags: ["Stack", "WebDev", "2026"]
      },
      {
        title: "Tips para optimizar consultas en MongoDB",
        content: "He estado trabajando con grandes volúmenes de datos y quería compartir algunos índices que me salvaron la vida. ¿Alguien tiene más trucos?",
        author: elena._id,
        authorName: elena.nombre,
        tags: ["MongoDB", "Performance", "Database"]
      },
      {
        title: "Novedades en Tailwind CSS v4",
        content: "La nueva versión de Tailwind trae cambios increíbles en el motor JIT. ¿Ya la probaron en sus proyectos de producción?",
        author: agustin._id,
        authorName: agustin.nombre,
        tags: ["Tailwind", "CSS", "Design"]
      }
    ];

    const createdPosts = await Post.insertMany(postsData);
    console.log('Posts de foro sembrados.');

    try {
      await Comment.create([
        {
          text: "Yo creo que Rust está ganando mucho terreno en el backend, ¡vale la pena echarle un ojo!",
          user: elena._id,
          authorName: elena.nombre,
          avatar: elena.avatar,
          post: createdPosts[0]._id
        },
        {
          text: "Totalmente de acuerdo, los índices compuestos son clave.",
          user: agustin._id,
          authorName: agustin.nombre,
          avatar: agustin.avatar,
          post: createdPosts[1]._id
        }
      ]);
      console.log('Comentarios de foro sembrados.');
    } catch (cErr) {
      console.error('Error sembrando comentarios:', cErr.message);
    }

    // 4. Empleos Reales (Generación Masiva de 200 empleos)
    const jobsCount = await Job.countDocuments();
    if (jobsCount < 200) {
      await Job.deleteMany({}); // Limpiamos para asegurar los 200 nuevos

      const titles = ["Frontend Developer", "Backend Engineer", "Fullstack Dev", "Mobile App Specialist", "DevOps Engineer", "UI/UX Designer", "Data Analyst", "Security Expert", "QA Automation", "Cloud Architect"];
      const companies = ["Devvia Core", "Ag Studio", "CreativeFlow", "AppMasters", "SkyNet", "SafeCode", "TechGurus", "MetaSystems", "SoftSolutions", "GlobalLogic"];
      const locations = ["Remoto", "Híbrido", "España", "México DF", "Argentina", "USA", "Colombia", "Chile"];
      const techPool = ["React", "Node.js", "TypeScript", "Tailwind", "MongoDB", "Express", "Python", "Go", "AWS", "Docker", "Figma", "React Native", "Flutter", "Kubernetes", "Next.js", "GraphQL"];

      const massJobs = [];

      for (let i = 1; i <= 200; i++) {
        const title = titles[Math.floor(Math.random() * titles.length)];
        const company = companies[Math.floor(Math.random() * companies.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const type = ["Full-time", "Part-time", "Contract"][Math.floor(Math.random() * 3)];
        
        // Seleccionar 3-4 tags aleatorios
        const tags = [...techPool].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 3);

        massJobs.push({
          title: title,
          company,
          location,
          salary: `USD ${Math.floor(Math.random() * 3000) + 1500} - ${Math.floor(Math.random() * 2000) + 4500}`,
          tags,
          type,
          description: `Esta es la descripción detallada de la vacante número ${i} para la empresa ${company}. Buscamos talento con hambre de aprender.`
        });
      }

      await Job.insertMany(massJobs);
      console.log('200 Empleos sembrados con éxito.');
    }

    console.log('Proceso de seeding finalizado.');
  } catch (err) {
    console.error('Error en el proceso de seeding:', err);
  }
};

module.exports = seedDatabase;
