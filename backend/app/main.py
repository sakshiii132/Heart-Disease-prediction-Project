
from pathlib import Path

import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


#  Load trained model and preprocessing information

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "heart_disease_artifact.pkl"

artifact = joblib.load(MODEL_PATH)

model = artifact["model"]
feature_columns = artifact["feature_columns"]

cholesterol_mean = artifact["cholesterol_mean"]
resting_bp_mean = artifact["resting_bp_mean"]

age_group_bins = artifact["age_group_bins"]
age_group_labels = artifact["age_group_labels"]


#  Create FastAPI application

app = FastAPI(
    title="Heart Disease Prediction API",
    description="API for predicting heart disease",
    version="1.0"
)


#  Allow React frontend to connect

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://heart-disease-prediction-project.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input data format

class HeartDiseaseInput(BaseModel):

    Age: int = Field(ge=1, le=100)
    Sex: str
    ChestPainType: str
    RestingBP: float = Field(ge=0, le=300)
    Cholesterol: float = Field(ge=0, le=700)
    FastingBS: int = Field(ge=0, le=1)
    RestingECG: str
    MaxHR: int = Field(ge=1, le=250)
    ExerciseAngina: str
    Oldpeak: float
    ST_Slope: str


#  Home route

@app.get("/")
def home():
    return {
        "message": "Heart Disease Prediction API is running!"
    }


#  Prediction route

@app.post("/predict")
def predict_heart_disease(data: HeartDiseaseInput):

    try:

        input_data = data.model_dump()

        # Replace zero values using training means
        if input_data["RestingBP"] == 0:
            input_data["RestingBP"] = resting_bp_mean

        if input_data["Cholesterol"] == 0:
            input_data["Cholesterol"] = cholesterol_mean

        # Calculate Age Group
        age_group = pd.cut(
            [input_data["Age"]],
            bins=age_group_bins,
            labels=age_group_labels
        )[0]

        if pd.isna(age_group):
            raise HTTPException(
                status_code=400,
                detail="Age is outside the supported age-group range."
            )

        input_data["AgeGroup"] = str(age_group)

        # Feature engineering
        input_data["MaxHR_Percentage"] = (
            input_data["MaxHR"] /
            (220 - input_data["Age"])
        ) * 100

        input_data["Age_Oldpeak"] = (
            input_data["Age"] * input_data["Oldpeak"]
        )

        # Convert input into DataFrame
        input_df = pd.DataFrame([input_data])

        # One-hot encoding
        input_df = pd.get_dummies(
            input_df,
            drop_first=True
        )

        # Match training feature columns
        input_df = input_df.reindex(
            columns=feature_columns,
            fill_value=0
        )

        # Make prediction
        prediction = int(model.predict(input_df)[0])

        # Get probability
        probabilities = model.predict_proba(input_df)[0]

        heart_disease_probability = float(probabilities[1])

        result = (
            "Heart disease detected"
            if prediction == 1
            else "No heart disease detected"
        )

        return {
            "prediction": prediction,
            "result": result,
            "heart_disease_probability": round(
                heart_disease_probability * 100, 2
            )
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(error)}"
        )
