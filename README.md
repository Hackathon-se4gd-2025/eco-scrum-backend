# 🌱 EcoScrum Backend API

This is the backend service for **EcoScrum**, a sustainability-focused agile project management platform. Built with **NestJS**, **MongoDB**, and documented via **Swagger**, this API enables teams to manage projects, tasks, sprints, backlog items, and retrospective reviews — all with sustainability metrics integrated via the SuSAF framework.

---

## 🚀 Features

- 👥 **User and Team Management**  
- 🗂️ **Project and Sprint Tracking**  
- ✅ **Task & Backlog Item CRUD**  
- 🔁 **Retrospective Feedback & Completion Tracking**  
- ♻️ **Sustainability Metrics Integration (SuSAF)**  
- 🤖 **AI-based Recommendations (optional)**  
- 📊 **Swagger API Documentation**

---

## 📦 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** MongoDB (via Mongoose)
- **Documentation:** Swagger (OpenAPI 3.0)
- **Deployment:** Render

---

## 🌐 API Documentation

- **Production Swagger URL:**  
  👉 [`https://eco-scrum-backend.onrender.com/api#/`](https://eco-scrum-backend.onrender.com/api#/)

Once the app is running locally, you can also access docs at:
```bash
http://localhost:4000/api
```

### Project Structure
```
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── users/
│   ├── team-members/
│   ├── projects/
│   ├── sprints/
│   ├── tasks/
│   ├── backlog-items/
│   ├── items/
│   └── susaf/
``` 
## Setup
1. Clone the repository
``` git clone https://github.com/your-org/ecoscrum-backend.git
cd ecoscrum-backend 
```

2. Install dependencies 
```
npm install
```
3. Environment variables

Create a .env file in the root with the following:
```
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```
4. Run the app
``` # development
npm run start

# production
npm run build
npm run start:prod
```
## 📬 REST API Endpoints
### 📬 API Endpoints

| Category | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| 🧑 Users | `POST` | `/users` | Create a new user |
|          | `GET`  | `/users?email=:email` | Get user by email |
| 👥 Team Members | `POST` | `/team-members` | Add a member to a project |
|                | `GET`  | `/team-members/project/:projectId` | Get members by project ID |
| 📁 Projects | `GET`  | `/projects` | Get all projects |
|             | `POST` | `/projects` | Create a new project |
|             | `PATCH`| `/projects/:id` | Update project (e.g., add sprint ID) |
| 🌀 Sprints | `GET`  | `/sprints` | Get all sprints |
|           | `GET`  | `/sprints/:id` | Get sprint by ID |
|           | `POST` | `/sprints` | Create a new sprint |
|           | `PATCH`| `/sprints/:id` | Update sprint |
|           | `PATCH`| `/sprints/:id/retrospective` | Save or update retrospective |
|           | `PATCH`| `/sprints/:id/complete` | Mark sprint as completed |
| ✅ Tasks | `GET`  | `/tasks/project/:projectId` | Get tasks by project ID |
|          | `GET`  | `/tasks/sprint/:sprintId` | Get tasks by sprint ID |
|          | `POST` | `/tasks` | Create a task |
|          | `PATCH`| `/tasks/:id` | Update a task |
|          | `PATCH`| `/tasks/:id/status` | Update task status |
|          | `DELETE`| `/tasks/:id` | Delete a task |
| 📋 Backlog Items | `GET`  | `/backlog-items/project/:projectId` | Get backlog items by project ID |
|                  | `POST` | `/backlog-items` | Add a new backlog item |
|                  | `PATCH`| `/backlog-items/:id` | Update a backlog item |
|                  | `DELETE`| `/backlog-items/:id` | Delete a backlog item |
| 🧠 SuSAF | `GET`  | `/susaf/effects/:projectId` | Get selected sustainability effects |
|         | `POST` | `/susaf/effects/:projectId` | Save selected effects |
|         | `GET`  | `/susaf/recommendations/:projectId` | Get AI-based sustainability recommendations |
|         | `POST` | `/susaf/token/:projectId` | Save OpenAI API token |