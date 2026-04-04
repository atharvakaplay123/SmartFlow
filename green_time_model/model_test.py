import joblib
import pandas as pd
model = joblib.load("model.pkl")

vehicle_count = int(input("enter the value: "))
input_df = pd.DataFrame([[vehicle_count]], columns=["vehicle_count"])

prediction = model.predict(input_df)

print("estimated time: ",int(prediction[0]))