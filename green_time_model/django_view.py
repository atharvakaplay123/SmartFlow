import pandas as pd
from django.http import JsonResponse
import joblib

model = joblib.load("model.pkl")

def predict_green_time(request):
    vehicle_count = int(request.GET.get("vehicles", 10))

    # ✅ FIX HERE
    input_df = pd.DataFrame([[vehicle_count]], columns=["vehicle_count"])

    prediction = model.predict(input_df)

    return JsonResponse({
        "vehicle_count": vehicle_count,
        "predicted_green_time": int(prediction[0])
    })