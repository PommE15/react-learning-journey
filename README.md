# React Learning Journey Visualization

A web application that visualizes a learner's progress, course
relationships, and personalized recommendations using an interactive
network graph.

## 🚀 Tech Stack

-   **React**, **TypeScript**, **Vite** 
-   **React Router**
-   **TailwindCSS**, **shadcn/ui**
-   **D3.js** (network graph)
-   UI/UX enhancements: **Voronoi overlay** + **debounced interactions**
-   Colors inspired by **Schole** --- https://www.schole.ai/

## 🌐 Live Demo

Hosted on GitHub Pages:\
**https://pomme15.github.io/react-learning-journey/**

## 📦 Installation

``` bash
pnpm install
```

## ▶️ Run the Project

``` bash
pnpm run dev
```

This starts the local development server.

## 🛠 Build for Production

``` bash
pnpm run build
```

## 🚢 Deploy to GitHub Pages

The repo is already configured for deployment.

To redeploy:

``` bash
npm run deploy
```

This builds and pushes the `/docs` folder to the `gh-pages` branch.

## 🔍 Features

-   Interactive **network graph** showing learning paths
-   Highlights **completed**, **in progress**, and **recommended** courses
-   Smooth hover + selection using **Voronoi diagrams**
-   Improved responsiveness with **debounced mouse events**
-   Filter courses by category (example interaction)

## 🧪 Data

This project uses mock data representing:

- About 40 courses across 6 categories
- For each course: there is acourse list with time, sessions, tasks, and performance metrics, and also course nodes and link relationships
- User's completion state (completed / in progress / recommended)

This structure can be easily replaced with real API data later.
