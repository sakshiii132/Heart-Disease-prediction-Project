
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_home_endpoint():
    response = client.get("/")

    assert response.status_code == 200


def test_invalid_prediction():
    response = client.post(
        "/predict",
        json={
            "Age": 150,
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
    )

    assert response.status_code == 422
