from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

app = Flask(__name__)

# Sample booking data (Fake past bookings data)
data = {
    "date": pd.date_range(start="2024-01-01", periods=100, freq="D"),
    "bookings": np.random.randint(1, 50, 100),
}
df = pd.DataFrame(data)
df.set_index("date", inplace=True)

# Train ARIMA Time-Series Model
model = ARIMA(df["bookings"], order=(5, 1, 0))
trained_model = model.fit()

@app.route("/")
def home():
    return "Welcome to the AI Model API. Use /predict-price to get dynamic pricing."
@app.route("/predict-price", methods=["POST"])
def predict_price():
    try:
        # Get JSON data from request
        data = request.get_json()
        days_ahead = data.get("days_ahead", 1)  # Default 1 day ahead
        base_price = data.get("base_price")  # Turf's original price

        if base_price is None:
            return jsonify({"error": "base_price is required"}), 400

        # Make prediction using ARIMA
        forecast = trained_model.forecast(steps=days_ahead)
        predicted_demand = int(forecast.iloc[-1])  # Last predicted demand

        # Check if the turf has NO BOOKINGS
        if predicted_demand == 0:
            dynamic_price = round(base_price * 0.5, 3)  # Apply 50% discount
        else:
            price_multiplier = 1 + (predicted_demand / 100)
            dynamic_price = round(base_price * price_multiplier, 3)

        return jsonify({
            "predicted_demand": predicted_demand,
            "dynamic_price": dynamic_price
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    try:
        # Get JSON data from request
        data = request.get_json()
        days_ahead = data.get("days_ahead", 1)  # Default 1 day ahead
        base_price = data.get("base_price")  # Turf's original price

        if base_price is None:
            return jsonify({"error": "base_price is required"}), 400

        # Make prediction using ARIMA
        forecast = trained_model.forecast(steps=days_ahead)
        predicted_demand = int(forecast.iloc[-1])  # Last predicted demand

        # Check if the turf has NO BOOKINGS
        if predicted_demand == 0:
            dynamic_price = round(base_price * 0.5, 3)  # Apply 50% discount
        else:
            price_multiplier = 1 + (predicted_demand / 100)
            dynamic_price = round(base_price * price_multiplier, 3)

        return jsonify({
            "predicted_demand": predicted_demand,
            "dynamic_price": dynamic_price
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    try:
        # Get JSON data from request
        data = request.get_json()
        days_ahead = data.get("days_ahead", 1)  # Default 1 day ahead
        base_price = data.get("base_price")  # Get actual turf price

        if base_price is None:
            return jsonify({"error": "base_price is required"}), 400

        # Make prediction
        forecast = trained_model.forecast(steps=days_ahead)
        predicted_demand = int(forecast.iloc[-1])  # Get last predicted demand

        # Calculate dynamic price based on each turf’s base price
        price_multiplier = 1 + (predicted_demand / 100)
        dynamic_price = round(base_price * price_multiplier, 3)

        return jsonify({"predicted_demand": predicted_demand, "dynamic_price": dynamic_price})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    try:
        # Get the number of days ahead from request
        data = request.get_json()
        days_ahead = data.get("days_ahead", 1)  # Default to 1 day ahead
        
        # Make prediction
        forecast = trained_model.forecast(steps=days_ahead)
        predicted_demand = int(forecast.iloc[-1])  # Get the last forecasted value

        # Define base price and demand-based increase
        base_price = 100  # Set base price (example)
        price_multiplier = 1 + (predicted_demand / 100)  # Increase price based on demand
        dynamic_price = round(base_price * price_multiplier, 3)  # Final price

        return jsonify({"predicted_demand": predicted_demand, "dynamic_price": dynamic_price})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
