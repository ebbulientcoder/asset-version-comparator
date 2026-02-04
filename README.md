# asset-version-comparator
Full Stack Asset Version Comparator using React, Node.js, Express, Sequelize &amp; SQL Server


# Asset Version Comparator (SQL)

A full-stack web application that allows users to upload text-based assets, maintain version history, and visually compare any two versions using a Git-style diff viewer.

---

## Features

- Upload text-based assets (files)
- Automatic versioning for each asset
- Compare any two versions side-by-side
- Line-level and word-level difference highlighting
- SQL Server database with Sequelize ORM
- Clean and responsive React UI

---

## Tech Stack

Frontend:
- React (Vite)
- Axios
- diff library
- CSS (custom UI)

Backend:
- Node.js
- Express.js
- Sequelize ORM
- Microsoft SQL Server
- Multer (file uploads)

---

## Project Structure

asset-version-comparator  
├── backend  
│   ├── config  
│   │   └── database.js  
│   ├── models  
│   │   ├── asset.js  
│   │   └── assetVersion.js  
│   ├── routes  
│   │   └── assets.js  
│   ├── server.js  
│   ├── package.json  
│   └── .env.example  
│  
├── frontend  
│   ├── src  
│   │   ├── App.jsx  
│   │   └── App.css  
│   ├── index.html  
│   └── package.json  
│  
├── .gitignore  
└── README.md

---

## Environment Setup

Create a `.env` file inside the backend folder.

Example `.env` file:

DB_HOST=localhost  
DB_PORT=1433  
DB_NAME=your_db_name  
DB_USER=your_db_user  
DB_PASSWORD=your_db_password  
DB_DIALECT=mssql  

Do NOT commit the `.env` file to GitHub.

---

## How to Run the Project

### Backend Setup

Open terminal and run:

cd backend  
npm install  
node server.js  

Backend will start at:

http://localhost:8003

---

### Frontend Setup

Open another terminal and run:

cd frontend  
npm install  
npm run dev  

Frontend will start at:

http://localhost:5173

---

## API Endpoints

GET /api/assets  
Fetch all assets with their versions

POST /api/assets/upload  
Upload a new asset or create a new version

POST /api/assets/compare  
Compare two versions of an asset

---

## Application Flow

1. User uploads a file with an asset name  
2. Each upload creates a new version automatically  
3. User selects two versions of the same asset  
4. Application highlights differences line-by-line and word-by-word  

---

## Future Enhancements

- Authentication and authorization
- Asset deletion and version rollback
- Syntax highlighting for code files
- Docker support
- Cloud deployment

---

## Author

Mohd Yusuf Ansari  
Full Stack Developer
