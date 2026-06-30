# app.py - simple Streamlit app for the retention team.
# Run from the project folder:   streamlit run app/app.py
import joblib
import pandas as pd
import streamlit as st

st.set_page_config(page_title="NPS Prediction", layout="centered")


# load the bundle the notebook saved (Day 10)
@st.cache_resource
def load_bundle():
    return joblib.load("models/app_bundle.pkl")


bundle = load_bundle()
model = bundle["model"]
feature_columns = bundle["feature_columns"]
class_names = bundle["class_names"]
customers = bundle["customers"]
default_row = bundle["default_row"]
top_features = bundle["top_features"]


st.title("Customer NPS Prediction")
st.write(
    "Predict if a customer is a Detractor, Passive, or Promoter. "
    "This helps the retention team decide who to contact first."
)

mode = st.radio("How do you want to choose the customer?",
                ["Pick an existing customer", "Enter details by hand"])


# ---- build a one-row table for the chosen customer ----
if mode == "Pick an existing customer":
    cid = st.selectbox("Customer ID", customers["Customer ID"].tolist())
    customer = customers[customers["Customer ID"] == cid][feature_columns].reset_index(drop=True)

else:
    st.write("Change the main fields below. Anything you leave is set to a typical value.")
    customer = default_row.copy().reset_index(drop=True)
    i = 0

    customer.loc[i, "Tenure in Months"] = st.number_input(
        "Tenure (months)", 0, 80, int(default_row["Tenure in Months"].iloc[0]))
    customer.loc[i, "Monthly Charge"] = st.number_input(
        "Monthly charge", 0.0, 200.0, float(default_row["Monthly Charge"].iloc[0]))
    customer.loc[i, "Contract"] = st.selectbox(
        "Contract", ["Month-to-Month", "One Year", "Two Year"])
    customer.loc[i, "Internet Type"] = st.selectbox(
        "Internet type", ["Fiber Optic", "DSL", "Cable", "No internet"])
    customer.loc[i, "Payment Method"] = st.selectbox(
        "Payment method", ["Bank Withdrawal", "Credit Card", "Mailed Check"])
    customer.loc[i, "Online Security"] = st.selectbox("Online security", ["No", "Yes"])
    customer.loc[i, "num_services"] = st.slider(
        "Number of services", 0, 10, int(default_row["num_services"].iloc[0]))

    # keep the engineered features matching the entered values
    customer.loc[i, "is_new_customer"] = 1 if customer.loc[i, "Tenure in Months"] <= 12 else 0
    customer.loc[i, "charge_per_service"] = customer.loc[i, "Monthly Charge"] / (customer.loc[i, "num_services"] + 1)
    customer.loc[i, "is_autopay"] = 1 if customer.loc[i, "Payment Method"] == "Bank Withdrawal" else 0


# ---- predict ----
if st.button("Predict NPS"):
    X_one = customer[feature_columns]
    proba = model.predict_proba(X_one)[0]
    prediction = class_names[proba.argmax()]

    st.subheader("Prediction: " + prediction)

    # probabilities as a small bar chart
    prob_table = pd.DataFrame({"probability": proba}, index=class_names)
    st.bar_chart(prob_table)

    # show this customer's values on the main features the model uses
    st.write("**Main things the model looks at, for this customer:**")
    for feature in top_features:
        if feature in customer.columns:
            value = customer[feature].iloc[0]
            st.write("- ", feature, ":", value)

    if prediction == "Detractor":
        st.warning(
            "This customer is likely a Detractor. The most common helpful action is to "
            "offer a longer contract (see the drivers analysis)."
        )