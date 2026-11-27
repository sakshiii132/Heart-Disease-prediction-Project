# ❤️ Heart Disease Prediction – End-to-End Machine Learning Web Application

An end-to-end Machine Learning application that predicts the likelihood of heart disease based on patient health parameters.

The project combines a trained Random Forest classification model, a FastAPI backend, and a React frontend to provide predictions through an interactive web interface.

The application is currently deployed online using **Render (Backend)** and **Vercel (Frontend)**. Docker is used to containerize the backend, and the Docker image has been successfully pushed to **AWS Elastic Container Registry (ECR)**. AWS EC2 deployment is the next stage of the cloud deployment workflow.

<p align="center">

**🌐 Live Demo:**  
https://heart-disease-prediction-project-kappa.vercel.app/

**📂 GitHub Repository:**  
https://github.com/sakshiii132/Heart-Disease-prediction-Project

**⚙️ Backend API:**  
https://heart-disease-prediction-project-1k3c.onrender.com/

**📖 API Documentation:**  
https://heart-disease-prediction-project-1k3c.onrender.com/docs

</p>

---

## 📌 Table of Contents

1. Project Overview
2. Project Objectives
3. Key Features
4. Technologies Used
5. Dataset Description
6. Machine Learning Workflow
7. Model Development
8. Model Deployment Architecture
9. Project Structure
10. Installation and Setup
11. Running the Backend
12. Running the Frontend
13. API Documentation
14. Sample Prediction Request
15. Automated Testing and CI
16. Cloud Deployment – Render and Vercel
17. Docker and AWS Implementation
18. Environment Variables
19. Challenges and Solutions
20. Future Improvements
21. Disclaimer
22. Author

---

## 1. Project Overview

Heart disease is a major health concern worldwide. Machine Learning can help identify patterns in patient health data and estimate the likelihood of heart disease.

This project implements a classification-based prediction system using a Random Forest model trained on a heart disease dataset.

Users can enter health-related information through a web interface. The frontend sends the information to a FastAPI backend, which processes the input and generates a prediction using the trained model.

The prediction and estimated probability are then displayed on the frontend.

The application follows a complete end-to-end Machine Learning workflow:

**Dataset → Data Preprocessing → Exploratory Data Analysis → Feature Engineering → Model Training → Model Evaluation → Model Saving → FastAPI → React → Docker → Cloud Deployment**

---

## 2. Project Objectives

- Develop a Machine Learning classification model for heart disease prediction.
- Perform data cleaning and preprocessing.
- Conduct Exploratory Data Analysis (EDA).
- Apply feature engineering and feature encoding.
- Train and evaluate classification models.
- Save the trained model for future predictions.
- Build a REST API using FastAPI.
- Develop an interactive frontend using React.
- Connect the frontend and backend.
- Containerize the backend application using Docker.
- Store the Docker image in AWS Elastic Container Registry (ECR).
- Implement automated testing using GitHub Actions.
- Deploy the frontend and backend using cloud hosting platforms.
- Prepare the Dockerized backend for deployment on AWS EC2.

---

## 3. Key Features

### Machine Learning
- Data preprocessing and cleaning.
- Exploratory Data Analysis.
- Feature engineering.
- Categorical variable encoding.
- Random Forest classification.
- Prediction probability calculation.
- Saved model artifact for reuse.

### Backend
- FastAPI-based REST API.
- Pydantic input validation.
- Model loading using Joblib.
- Missing-value handling using training-data means for specified fields.
- Feature alignment before prediction.
- CORS configuration for frontend connectivity.
- Error handling.

### Frontend
- Interactive React interface.
- Health parameter input form.
- API integration using Fetch.
- Prediction result display.
- Prediction probability display.
- Error handling for API communication.

### Deployment and Development
- GitHub version control.
- GitHub Actions CI workflow.
- Render backend hosting.
- Vercel frontend hosting.
- Docker backend containerization.
- AWS CLI configuration.
- AWS ECR repository creation.
- Docker image upload to AWS ECR.
- Preparation for AWS EC2 deployment.

---

## 4. Technologies Used

| Category | Technologies |
|---|---|
| Programming Language | Python, JavaScript |
| Data Analysis | Pandas, NumPy |
| Data Visualization | Matplotlib, Seaborn |
| Machine Learning | Scikit-learn |
| Model Serialization | Joblib |
| Backend | FastAPI |
| API Server | Uvicorn |
| Data Validation | Pydantic |
| Frontend | React.js |
| Frontend Build Tool | Vite |
| Containerization | Docker |
| Version Control | Git, GitHub |
| Automated Testing | Pytest, GitHub Actions |
| Backend Deployment | Render |
| Frontend Deployment | Vercel |
| Cloud Platform | Amazon Web Services (AWS) |
| Container Registry | Amazon Elastic Container Registry (ECR) |
| Cloud Infrastructure | Amazon EC2 (planned deployment) |

---

## 5. Dataset Description

The project uses a heart disease dataset containing patient health information and a target variable indicating the presence or absence of heart disease.

The dataset includes the following attributes:

| Feature | Description |
|---|---|
| Age | Age of the patient |
| Sex | Sex of the patient |
| ChestPainType | Type of chest pain |
| RestingBP | Resting blood pressure |
| Cholesterol | Serum cholesterol level |
| FastingBS | Fasting blood sugar indicator |
| RestingECG | Resting electrocardiogram results |
| MaxHR | Maximum heart rate achieved |
| ExerciseAngina | Exercise-induced angina |
| Oldpeak | ST depression induced by exercise |
| ST_Slope | Slope of the peak exercise ST segment |
| HeartDisease | Target variable |

**Target variable:**

- `0` – No heart disease indicated in the dataset.
- `1` – Heart disease indicated in the dataset.

The target column is used during model training and is not required as an input when making a prediction.

---

## 6. Machine Learning Workflow

### Step 1: Data Collection

The heart disease dataset was loaded into Python using Pandas.

### Step 2: Data Cleaning

The dataset was inspected for:
- Missing values.
- Duplicate records.
- Incorrect data types.
- Invalid or inconsistent values.

### Step 3: Exploratory Data Analysis (EDA)

EDA was performed to understand the dataset and identify patterns.

Analysis included:
- Distribution of patient ages.
- Heart disease distribution.
- Cholesterol analysis.
- Resting blood pressure analysis.
- Maximum heart rate analysis.
- Relationships between input features and the target variable.
- Correlation analysis.

Visualization libraries used:
- Matplotlib
- Seaborn

### Step 4: Feature Engineering

Additional features were created to improve the information available to the model.

**Age Group**

Patients were grouped into age categories using `pd.cut()`.

**Maximum Heart Rate Percentage**

Calculated using:

`MaxHR_Percentage = (MaxHR / (220 - Age)) × 100`

**Age and Oldpeak Interaction**

Calculated using:

`Age_Oldpeak = Age × Oldpeak`

### Step 5: Categorical Encoding

Categorical variables were converted into numerical representations using One-Hot Encoding.

`pd.get_dummies()` was used with `drop_first=True`.

### Step 6: Model Training

A Random Forest Classifier was trained using the prepared dataset.

Random Forest combines multiple decision trees to generate a classification result.

### Step 7: Model Evaluation

The model was evaluated using appropriate classification evaluation techniques.

Common classification metrics include:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion Matrix
- ROC-AUC

Refer to the project notebooks for the actual experimental results.

### Step 8: Model Saving

The trained model and preprocessing information were saved together using Joblib.

The saved artifact contains:

- Trained model.
- Training feature columns.
- Cholesterol mean.
- Resting blood pressure mean.
- Age group bins.
- Age group labels.

The artifact is stored at:

`backend/models/heart_disease_artifact.pkl`

This allows the backend to load the trained model without retraining it every time the application starts.

---

## 7. Model Development

The project uses the **Random Forest Classifier**.

Random Forest is an ensemble learning algorithm that builds multiple decision trees and combines their predictions.

### Why Random Forest?

- Handles classification problems.
- Can model nonlinear relationships.
- Combines multiple decision trees.
- Supports probability predictions.
- Provides feature importance information.

### Prediction Process

1. User enters health parameters.
2. Frontend sends the information to the backend.
3. FastAPI validates the request.
4. Backend handles specified zero-value replacements.
5. Feature engineering is performed.
6. Categorical features are encoded.
7. Input columns are aligned with the model's training features.
8. The Random Forest model generates a prediction.
9. Prediction probability is calculated.
10. The result is returned to the frontend.

---

## 8. Model Deployment Architecture

The application uses a separate frontend and backend deployment architecture.

### Current Live Application

```text
                USER
                  |
                  v
           REACT FRONTEND
               (Vercel)
                  |
                  | HTTP POST Request
                  v
            FASTAPI BACKEND
                (Render)
                  |
                  v
           INPUT VALIDATION
               (Pydantic)
                  |
                  v
           DATA PREPROCESSING
                  |
                  v
           FEATURE ENGINEERING
                  |
                  v
            TRAINED ML MODEL
             (Random Forest)
                  |
                  v
           PREDICTION RESULT
                  |
                  v
             JSON RESPONSE
                  |
                  v
            REACT FRONTEND
                  |
                  v
             DISPLAY RESULT
```

### Docker and AWS Workflow

```text
          BACKEND APPLICATION
                   |
                   v
                 DOCKER
                   |
                   v
             DOCKER IMAGE
                   |
                   v
                AWS ECR
            (Image Storage)
                   |
                   v
                AWS EC2
          (Deployment Pending)
                   |
                   v
           DOCKER CONTAINER
          (Deployment Pending)
                   |
                   v
            LIVE BACKEND API
```

---

## 9. Project Structure

```text
Heart-Disease-prediction-Project/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   │
│   ├── app/
│   │   └── main.py
│   │
│   ├── models/
│   │   └── heart_disease_artifact.pkl
│   │
│   ├── tests/
│   │   └── test_api.py
│   │
│   └── requirements.txt
│
├── data/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   │
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
│
├── notebooks/
│
├── .gitignore
├── README.md
├── COMMANDS.md
├── PROJECT_DOCUMENTATION.md
└── heart.csv
```

*Note: This structure highlights the main project components. Some generated files and additional assets are omitted.*

---

## 10. Installation and Setup

Follow these steps to run the project locally.

### Prerequisites

Install the following:

- Python 3.10 or later (use a version compatible with the installed dependencies).
- Node.js and npm.
- Git.
- Visual Studio Code (recommended).

### Step 1: Clone the Repository

```bash
git clone https://github.com/sakshiii132/Heart-Disease-prediction-Project.git
```

Navigate into the project:

```bash
cd Heart-Disease-prediction-Project
```

### Step 2: Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Activate it on macOS/Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 11. Running the Backend

Make sure you are inside the `backend` directory and the virtual environment is activated.

Run the FastAPI server:

```bash
python -m uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Open the interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

The API documentation allows you to test endpoints directly through Swagger UI.

### Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Checks whether the API is running |
| POST | `/predict` | Generates a heart disease prediction |

---

## 12. Running the Frontend

Open a new terminal.

Navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend directory for local development:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Open the URL in your browser.

**Important:** The backend must be running for the prediction functionality to work locally.

---

## 13. API Documentation

The project uses FastAPI to expose the trained Machine Learning model through a REST API.

### Base URL – Production

```text
https://heart-disease-prediction-project-1k3c.onrender.com
```

### Home Endpoint

**Request:**

```http
GET /
```

**Example Response:**

```json
{
  "message": "Heart Disease Prediction API is running!"
}
```

### Prediction Endpoint

**Request:**

```http
POST /predict
```

The endpoint accepts patient information in JSON format and returns a prediction.

---

## 14. Sample Prediction Request

### Input JSON

```json
{
  "Age": 45,
  "Sex": "M",
  "ChestPainType": "ATA",
  "RestingBP": 120,
  "Cholesterol": 200,
  "FastingBS": 0,
  "RestingECG": "Normal",
  "MaxHR": 160,
  "ExerciseAngina": "N",
  "Oldpeak": 1.0,
  "ST_Slope": "Up"
}
```

### Example Response

```json
{
  "prediction": 0,
  "result": "No heart disease detected",
  "heart_disease_probability": 12.45
}
```

*The response above is illustrative. Actual predictions and probability values depend on the trained model and submitted input.*

### Response Explanation

| Field | Description |
|---|---|
| prediction | Model's predicted class (0 or 1) |
| result | Human-readable prediction result |
| heart_disease_probability | Estimated model probability for class 1, expressed as a percentage |

---

## 15. Automated Testing and CI

GitHub Actions is used to automate backend testing.

The workflow is located at:

```text
.github/workflows/ci.yml
```

### CI Workflow

The workflow performs the following steps:

1. Checks out the GitHub repository.
2. Sets up Python 3.12.
3. Installs backend dependencies.
4. Runs automated tests using Pytest.

### Run Tests Locally

Navigate to the backend directory:

```bash
cd backend
```

Run:

```bash
python -m pytest -v
```

### Current Test Coverage

- Home endpoint availability.
- Invalid prediction input validation.

GitHub Actions automatically runs the configured tests when changes are pushed to the `main` branch or when a pull request targets `main`.

---

## 16. Cloud Deployment – Render and Vercel

The application is currently deployed using two separate hosting platforms.

### Frontend Deployment – Vercel

**Status: Completed**

The React frontend is deployed using Vercel.

**Live Application:**

https://heart-disease-prediction-project-kappa.vercel.app/

Configuration:

| Setting | Value |
|---|---|
| Framework | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

Production environment variable:

```env
VITE_API_URL=https://heart-disease-prediction-project-1k3c.onrender.com
```

Implemented:

- Connected the GitHub repository to Vercel.
- Configured the frontend project using Vite.
- Configured the production API URL.
- Connected the frontend to the deployed FastAPI backend.
- Enabled automatic deployments from GitHub.

Vercel hosts the frontend and serves the application through a public URL.

### Backend Deployment – Render

**Status: Completed**

The FastAPI backend is deployed using Render.

**Backend URL:**

https://heart-disease-prediction-project-1k3c.onrender.com/

**API Documentation:**

https://heart-disease-prediction-project-1k3c.onrender.com/docs

Configuration:

| Setting | Value |
|---|---|
| Service Type | Web Service |
| Root Directory | `backend` |
| Runtime | Python |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/` |

Implemented:

- Connected the GitHub repository to Render.
- Configured the backend root directory.
- Installed Python dependencies.
- Configured the Uvicorn start command.
- Configured CORS for the Vercel frontend.
- Enabled automatic deployments from GitHub.
- Successfully tested the prediction API.

Render hosts the backend API and processes prediction requests from the frontend.

### CORS Configuration

Cross-Origin Resource Sharing (CORS) allows the deployed frontend to communicate with the backend.

The backend permits requests from:

```python
allow_origins=[
    "http://localhost:5173",
    "https://heart-disease-prediction-project-kappa.vercel.app"
]
```

### Current Deployment Workflow

```text
             GITHUB REPOSITORY
                     |
              GITHUB ACTIONS
                (CI Tests)
                     |
             +-------+-------+
             |               |
           VERCEL          RENDER
         (Frontend)       (Backend)
             |               |
             +------ API ----+
                     |
               LIVE APPLICATION
```

When code changes are pushed to the connected GitHub repository, Render and Vercel can automatically deploy the latest changes.

**Note:** GitHub Actions currently runs automated backend tests. Render and Vercel handle their own automatic deployments. The CI workflow is not currently configured as a deployment approval gate.

---

## 17. Docker and AWS Implementation

Docker and AWS are used as part of the project's containerization and cloud infrastructure workflow.

### 17.1 Docker Implementation

**Status: Completed**

Docker was used to package the backend application and its dependencies into a container image.

Completed activities:

- Created a Docker image for the backend application.
- Tagged the Docker image for AWS Elastic Container Registry.
- Prepared the container image for cloud deployment.

Docker helps maintain a consistent application environment and simplifies deployment across different systems.

### 17.2 AWS Account and CLI Configuration

**Status: Completed**

AWS was configured using the AWS Command Line Interface (AWS CLI).

Completed activities:

- AWS account registration.
- AWS CLI configuration.
- AWS credentials configuration.
- AWS region configuration.

**AWS Region:**

```text
Asia Pacific (Sydney)
ap-southeast-2
```

### 17.3 Amazon Elastic Container Registry (ECR)

**Status: Completed**

Amazon Elastic Container Registry (ECR) is a managed service used to store Docker container images.

An ECR repository was created for the Heart Disease Prediction backend.

**Repository Name:**

```text
heart-disease-api
```

**AWS Region:**

```text
ap-southeast-2
```

Completed activities:

- Created the ECR repository.
- Tagged the Docker image.
- Authenticated Docker with AWS ECR.
- Successfully pushed the Docker image to the ECR repository.

This makes the Docker image available in AWS ECR for future deployment.

### 17.4 Amazon EC2 Deployment

**Status: Pending verification and implementation**

Amazon EC2 provides virtual servers in the cloud.

The next stage is to deploy the Docker image stored in ECR on an EC2 instance.

Planned activities:

1. Verify whether an EC2 instance already exists in the Sydney region.
2. Create an eligible EC2 instance if required.
3. Configure the instance and security group.
4. Install Docker on EC2.
5. Configure EC2 authentication with Amazon ECR.
6. Pull the Docker image from ECR.
7. Run the backend Docker container.
8. Configure the application port.
9. Test the backend using the EC2 public endpoint.

**Important:** The Docker image has been pushed to AWS ECR, but the EC2 container deployment has not yet been confirmed. Therefore, the application is currently hosted on Render, not EC2.

### 17.5 Docker and AWS Implementation Status

| Component | Status |
|---|---|
| AWS account registration | Completed |
| AWS CLI configuration | Completed |
| Sydney region configuration | Completed |
| Docker image creation | Completed |
| Docker image tagging | Completed |
| ECR repository creation | Completed |
| Docker image pushed to ECR | Completed |
| EC2 instance creation | Pending verification |
| Docker installation on EC2 | Pending |
| Pulling image from ECR to EC2 | Pending |
| Running Docker container on EC2 | Pending |
| Testing EC2 deployment | Pending |

### 17.6 Docker and AWS Architecture

```text
        BACKEND APPLICATION
                 |
                 v
               DOCKER
                 |
                 v
           DOCKER IMAGE
                 |
                 v
              AWS ECR
          (Image Storage)
                 |
                 v
              AWS EC2
        (Deployment Pending)
                 |
                 v
         DOCKER CONTAINER
        (Deployment Pending)
                 |
                 v
          FASTAPI BACKEND
```

### AWS Cost Considerations

The use of Docker itself does not require a Docker license fee for this workflow. However, AWS resources can incur charges.

EC2, ECR storage, data transfer, public IPv4 addresses, and other resources are subject to their respective pricing and free-tier eligibility.

AWS deployment should be performed after checking account eligibility, available credits, and the current billing dashboard.

---

## 18. Environment Variables

The frontend uses the following environment variable:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the FastAPI backend |

For local development:

```env
VITE_API_URL=http://127.0.0.1:8000
```

For production:

```env
VITE_API_URL=https://heart-disease-prediction-project-1k3c.onrender.com
```

The frontend uses this variable to construct the prediction endpoint:

```javascript
const API_URL = `${import.meta.env.VITE_API_URL}/predict`;
```

**Important:** Vite environment variables prefixed with `VITE_` are exposed to frontend code. Do not store passwords, private keys, or secrets in them.

---

## 19. Challenges and Solutions

Some important challenges addressed during development:

| Challenge | Solution |
|---|---|
| Handling missing or zero-valued health inputs | Used stored training means for specified zero values |
| Categorical feature conversion | Applied One-Hot Encoding |
| Feature mismatch during prediction | Aligned input columns with saved training feature columns |
| Saving the trained model | Used Joblib serialization |
| Connecting frontend and backend | Integrated FastAPI using Fetch |
| Cross-origin request errors | Configured FastAPI CORS middleware |
| Backend deployment | Deployed FastAPI on Render |
| Frontend deployment | Deployed React application on Vercel |
| Automated testing | Configured GitHub Actions with Pytest |
| Containerizing backend | Used Docker to create a backend image |
| Cloud image storage | Created AWS ECR repository and pushed the Docker image |

---

## 20. Future Improvements

Potential improvements include:

- Complete AWS EC2 deployment.
- Run the Docker container on EC2.
- Configure a production-ready HTTPS endpoint for the EC2 deployment.
- Add more comprehensive automated tests.
- Improve model evaluation and compare additional classification algorithms.
- Add model explainability using SHAP or LIME.
- Improve input validation and user experience.
- Add interactive visualizations.
- Add model monitoring and performance tracking.
- Introduce user authentication if required.
- Improve accessibility and responsive design.
- Implement automated Docker image deployment through GitHub Actions.

---

## 21. Disclaimer

This project is developed for **educational and demonstration purposes only**.

The predictions generated by the Machine Learning model are not medical diagnoses and should not be used as a substitute for professional medical advice, diagnosis, or treatment.

The model's output represents a prediction based on patterns learned from its training dataset. Its performance on real-world patients has not been established through clinical validation.

Always consult a qualified healthcare professional for medical concerns.

---

## 22. Author

**Sakshi Parab**

M.Sc. Computer Science | Machine Learning | AI Development

### Project Links

- **GitHub:** https://github.com/sakshiii132/Heart-Disease-prediction-Project
- **Live Application:** https://heart-disease-prediction-project-kappa.vercel.app/
- **Backend API:** https://heart-disease-prediction-project-1k3c.onrender.com/
- **API Documentation:** https://heart-disease-prediction-project-1k3c.onrender.com/docs

---

<p align="center">

**Built with Python, Machine Learning, FastAPI, React, Docker and AWS.**

⭐ If you find this project useful, consider giving the repository a star!

</p>
