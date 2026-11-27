#  Heart Disease Prediction

### An End-to-End Machine Learning Application

A Machine Learning web application that predicts the likelihood of heart disease using patient health parameters. This project integrates a trained Random Forest Classifier with a FastAPI backend and React frontend, and demonstrates Docker containerization and AWS cloud container registry integration.

---

## 📌 Project Overview

Heart Disease Prediction is an end-to-end Machine Learning project designed to demonstrate how a trained ML model can be integrated into a real-world web application.

The application accepts patient health information through an interactive frontend, sends the information to a FastAPI backend, processes the input, and generates a prediction using a trained Random Forest Classifier.

The project covers the complete workflow, from data analysis and model development to API integration, containerization, and cloud image storage.

## ✨ Key Features

- Exploratory Data Analysis (EDA)
- Data cleaning and preprocessing
- Feature engineering
- Feature selection using Mutual Information
- Random Forest model training
- Model serialization using Joblib
- REST API development using FastAPI
- Input validation using Pydantic
- Interactive React frontend
- Docker containerization
- AWS Elastic Container Registry (ECR) integration

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Programming | Python, JavaScript |
| Data Analysis | Pandas, NumPy |
| Visualization | Matplotlib, Seaborn |
| Machine Learning | Scikit-learn |
| ML Algorithm | Random Forest Classifier |
| Model Serialization | Joblib |
| Backend | FastAPI, Uvicorn |
| Validation | Pydantic |
| Frontend | React.js, Vite, CSS |
| Containerization | Docker |
| Cloud | AWS ECR |
| Version Control | Git, GitHub |

## 🏗️ Project Architecture

```text
                 USER
                   |
                   v
            REACT FRONTEND
                   |
                   | HTTP POST Request
                   v
             FASTAPI BACKEND
                   |
                   v
             INPUT VALIDATION
                   |
                   v
            DATA PREPROCESSING
                   |
                   v
            FEATURE ENGINEERING
                   |
                   v
          RANDOM FOREST MODEL
                   |
                   v
               PREDICTION
                   |
                   v
             JSON RESPONSE
                   |
                   v
            REACT FRONTEND
                   |
                   v
             RESULT DISPLAY
```

## 📂 Project Structure

```text
Heart Disease Prediction/
│
├── backend/
│   ├── app/
│   │   └── main.py
│   │
│   ├── models/
│   │   └── heart_disease_artifact.pkl
│   │
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── package-lock.json
│
├── data/
│   └── heart.csv
│
├── notebooks/
│   └── Heart Disease Prediction.ipynb
│
├── .gitignore
├── COMMANDS.md
├── PROJECT_DOCUMENTATION.md
└── README.md
```

*This is a simplified overview. Refer to the repository for the actual files.*

## 🧠 Machine Learning Workflow

### 1. Data Collection

The project uses a heart disease dataset containing patient health parameters and medical attributes.

### 2. Exploratory Data Analysis

EDA was performed to understand:

- Dataset dimensions and structure
- Feature distributions
- Missing and zero values
- Outliers
- Relationships between variables
- Target variable distribution

### 3. Data Preprocessing

The preprocessing workflow includes:

- Handling missing values
- Handling invalid zero values
- Categorical variable encoding
- One-Hot Encoding
- Preparing features for model training

### 4. Feature Engineering

Additional features were created to capture useful relationships between patient attributes.

**Maximum Heart Rate Percentage**

```python
MaxHR_Percentage = MaxHR / (220 - Age) * 100
```

**Age and Oldpeak Interaction**

```python
Age_Oldpeak = Age * Oldpeak
```

Age grouping was also performed using predefined age intervals.

### 5. Feature Selection

The following techniques were used:

- Mutual Information
- Random Forest Feature Importance

These techniques helped evaluate the relevance of individual features.

### 6. Model Training

A Random Forest Classifier was trained using Scikit-learn.

The trained model was evaluated and saved using Joblib.

### 7. Model Serialization

The saved model artifact contains:

- Trained Machine Learning model
- Feature columns
- Cholesterol mean
- Resting blood pressure mean
- Age group bins
- Age group labels

This allows the backend to reuse the trained model and required preprocessing information.

## ⚙️ Backend – FastAPI

The backend is developed using FastAPI.

It receives patient information, validates the input, performs preprocessing and feature engineering, and generates predictions using the saved model.

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Checks API availability |
| POST | `/predict` | Generates a prediction |
| GET | `/docs` | Interactive Swagger documentation |

### Example API Request

```json
{
  "Age": 45,
  "Sex": "M",
  "ChestPainType": "ATA",
  "RestingBP": 130,
  "Cholesterol": 240,
  "FastingBS": 0,
  "RestingECG": "Normal",
  "MaxHR": 150,
  "ExerciseAngina": "N",
  "Oldpeak": 1.0,
  "ST_Slope": "Up"
}
```

### Example API Response

```json
{
  "prediction": 0,
  "result": "No heart disease detected",
  "heart_disease_probability": 39.56
}
```

*Example response for demonstration purposes.*

## 💻 Frontend – React

The frontend is developed using React and Vite.

It provides an interface for users to enter patient health information and view the prediction returned by the backend.

Main functionalities:

- Patient input collection
- Input validation
- API integration
- Prediction result display
- Probability visualization

## 🚀 Running the Project Locally

### Prerequisites

Install:

- Python
- Node.js and npm
- Git
- Docker Desktop (optional, for container execution)

### 1. Clone the Repository

```bash
git clone https://github.com/sakshiii132/Heart-Disease-prediction-Project.git
```

Navigate into the project directory:

```bash
cd Heart-Disease-prediction-Project
```

### 2. Start the Backend

Navigate to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Ensure the frontend API URL points to the running backend.

## 🐳 Docker Implementation

Docker was used to containerize the FastAPI backend.

This makes the backend easier to package and run in a consistent environment.

### Build Docker Image

Run inside the backend directory:

```bash
docker build -t heart-disease-api .
```

### Run Docker Container

```bash
docker run --rm -p 8000:8000 heart-disease-api
```

Access the API:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

### Important Docker Commands

| Command | Purpose |
|---|---|
| `docker --version` | Checks Docker installation |
| `docker images` | Lists Docker images |
| `docker ps` | Lists running containers |
| `docker ps -a` | Lists all containers |
| `docker build -t name .` | Builds an image |
| `docker run -p 8000:8000 name` | Runs a container |
| `docker stop container_id` | Stops a container |
| `docker rmi image_name` | Removes an image |

## ☁️ AWS – Elastic Container Registry (ECR)

Amazon Elastic Container Registry (ECR) was used to store the Dockerized backend image in a private AWS repository.

### AWS Workflow

1. Installed AWS CLI.
2. Authenticated with the AWS account.
3. Created a private ECR repository.
4. Authenticated Docker with ECR.
5. Tagged the local Docker image.
6. Pushed the image to AWS ECR.
7. Verified successful image upload.

### Tag Docker Image

Replace the placeholders with your AWS account ID and region:

```bash
docker tag heart-disease-api:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com/heart-disease-api:latest
```

### Push Docker Image

```bash
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.ap-southeast-2.amazonaws.com/heart-disease-api:latest
```

### AWS Progress

- [x] Docker image built successfully
- [x] Private ECR repository created
- [x] Docker image pushed to ECR
- [ ] ECS/Fargate application hosting

**Note:** The Docker image is stored in AWS ECR. ECS/Fargate hosting has not yet been configured, so the application does not currently have a public AWS backend URL.

## 🔐 Security

- Virtual environments and Node modules are excluded using `.gitignore`.
- AWS credentials and API keys should never be committed.
- Environment variables should be stored securely.
- Never publish private credentials or authentication tokens.

## 🔮 Future Improvements

- Deploy the backend and frontend to cloud hosting platforms.
- Configure production API URLs.
- Implement automated testing.
- Add model monitoring.
- Implement CI/CD using GitHub Actions.
- Improve application security and logging.

## ⚠️ Disclaimer

This project is developed for educational and demonstration purposes only.

The predictions generated by this application are based on a Machine Learning model and are not a medical diagnosis. The application is not clinically validated and must not replace professional medical advice. Always consult a qualified healthcare professional for medical decisions.

## 👩‍💻 Author

**Sakshi Parab**

M.Sc. Computer Science | Machine Learning | AI Engineering

GitHub: [sakshiii132](https://github.com/sakshiii132)

---

⭐ If you find this project interesting, consider giving the repository a star!
