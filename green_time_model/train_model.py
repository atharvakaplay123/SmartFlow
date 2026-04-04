import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

df = pd.read_csv("traffic_green_time_dataset.csv")

X = df[["vehicle_count"]]
y = df["green_time"]

model = RandomForestRegressor()
model.fit(X, y)

joblib.dump(model, "model.pkl")
print("Model trained and saved as model.pkl")
