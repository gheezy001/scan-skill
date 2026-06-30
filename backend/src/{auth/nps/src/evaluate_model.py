# Day 7: score a model and get its feature importance.
import pandas as pd
from sklearn.metrics import accuracy_score, f1_score, recall_score, cohen_kappa_score
from sklearn.inspection import permutation_importance

order = {"Detractor": 0, "Passive": 1, "Promoter": 2}


def score_model(model, X_test, y_test):
    pred = model.predict(X_test)
    return {
        "accuracy": round(accuracy_score(y_test, pred), 3),
        "macro_f1": round(f1_score(y_test, pred, average="macro"), 3),
        "QWK": round(cohen_kappa_score(y_test.map(order),
                                       pd.Series(pred, index=y_test.index).map(order),
                                       weights="quadratic"), 3),
        "detractor_recall": round(recall_score(y_test, pred, labels=["Detractor"], average="macro"), 3),
    }


def feature_importance(model, X_test, y_test):
    result = permutation_importance(model, X_test, y_test, n_repeats=5, random_state=42)
    importance = pd.Series(result.importances_mean, index=X_test.columns)
    return importance.sort_values(ascending=False)


if __name__ == "__main__":
    import joblib
    test = pd.read_csv("data/processed/test.csv")
    X_test = test.drop(columns=["NPS"])
    y_test = test["NPS"]
    model = joblib.load("models/final_model.pkl")
    print("scores:", score_model(model, X_test, y_test))
    print("\ntop features:")
    print(feature_importance(model, X_test, y_test).head(10).round(4))
