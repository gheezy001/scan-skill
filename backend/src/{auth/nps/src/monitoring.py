# Day 12: simple drift checks for monitoring the model in production.
import pandas as pd


def population_change(old, new, col):
    """Compare the share of each category of `col` between two periods."""
    a = old[col].value_counts(normalize=True)
    b = new[col].value_counts(normalize=True)
    table = pd.DataFrame({"old_share": a, "new_share": b}).fillna(0)
    table["change"] = (table["new_share"] - table["old_share"]).round(3)
    return table


def prediction_share(model, X, label="Detractor"):
    """Share of customers predicted as a given class (track this over time)."""
    pred = model.predict(X)
    return round((pred == label).mean(), 3)


if __name__ == "__main__":
    import joblib
    train = pd.read_csv("data/processed/train.csv")
    test = pd.read_csv("data/processed/test.csv")
    model = joblib.load("models/final_model.pkl")

    print("Predicted Detractor share:", prediction_share(model, test.drop(columns=["NPS"])))
    print("\nContract drift (train vs test):")
    print(population_change(train, test, "Contract"))
