# Day 8: check Detractor recall across customer groups.
import pandas as pd
import joblib


def detractor_recall(df):
    real = df["NPS"] == "Detractor"
    if real.sum() == 0:
        return None
    caught = ((df["NPS"] == "Detractor") & (df["pred"] == "Detractor")).sum()
    return round(caught / real.sum(), 3)


def recall_by_group(check, col):
    rows = []
    for group, sub in check.groupby(col):
        rows.append({"group": group,
                     "recall": detractor_recall(sub),
                     "real_detractors": int((sub["NPS"] == "Detractor").sum())})
    return pd.DataFrame(rows)


if __name__ == "__main__":
    test = pd.read_csv("data/processed/test.csv")
    model = joblib.load("models/final_model.pkl")

    check = test.copy()
    check["pred"] = model.predict(test.drop(columns=["NPS"]))

    print("Overall detractor recall:", detractor_recall(check))
    for col in ["Gender", "Senior Citizen", "Married", "Dependents"]:
        print("\n" + col)
        print(recall_by_group(check, col).to_string(index=False))
