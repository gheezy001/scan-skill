# Day 9: detractor rate by segment + the main actionable lever.
import pandas as pd


def det_rate(df):
    return round((df["NPS"] == "Detractor").mean(), 3)


def rate_by_segment(data, col):
    rows = []
    for g, sub in data.groupby(col):
        rows.append({"segment": g, "detractor_rate": det_rate(sub), "n": len(sub)})
    return pd.DataFrame(rows)


if __name__ == "__main__":
    data = pd.read_csv("data/processed/data_features.csv")
    print("Overall detractor rate:", det_rate(data))
    for col in ["Contract", "Internet Type", "is_new_customer"]:
        print("\n" + col)
        print(rate_by_segment(data, col).to_string(index=False))
