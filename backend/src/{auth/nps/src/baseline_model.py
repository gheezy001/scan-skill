# Day 5: a simple Logistic Regression baseline.
import pandas as pd
import joblib
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression


def build_model(X_train):
    text_cols = X_train.select_dtypes(include=["object","string"]).columns.tolist()
    num_cols  = X_train.select_dtypes(exclude=["object","string"]).columns.tolist()

    prep = ColumnTransformer([
        ("text", OneHotEncoder(handle_unknown="ignore"), text_cols),
        ("num", StandardScaler(), num_cols),
    ])

    model = Pipeline([
        ("prep", prep),
        ("clf", LogisticRegression(max_iter=1000, class_weight="balanced")),
    ])
    return model


# this part runs only when we run the file directly
if __name__ == "__main__":
    train = pd.read_csv("data/processed/train.csv")
    X_train = train.drop(columns=["NPS"])
    y_train = train["NPS"]

    model = build_model(X_train)
    model.fit(X_train, y_train)

    joblib.dump(model, "models/baseline_model.pkl")
    print("Saved model. Train accuracy:", round(model.score(X_train, y_train), 3))
