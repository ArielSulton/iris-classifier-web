from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import joblib
import os

app = FastAPI()

# CORS: agar frontend (Next.js) bisa akses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ganti dengan domain tertentu di production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pickle model
MODEL_PATH = "model.pkl"

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError("File model.pkl tidak ditemukan. Pastikan file sudah tersedia di direktori.")

model = joblib.load(MODEL_PATH)

# Schema input dari frontend
class IrisRequest(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float

# Endpoint prediksi
@app.post("/predict")
def predict(iris: IrisRequest):
    data = np.array([[iris.sepal_length, iris.sepal_width, iris.petal_length, iris.petal_width]])
    prediction = model.predict(data)[0]
    class_names = ["setosa", "versicolor", "virginica"]
    return {"prediction": class_names[prediction]}