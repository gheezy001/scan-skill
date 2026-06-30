# Build the NPS target and drop the columns that leak the answer.
import pandas as pd


def build_target(df):
    # turn the 1-5 satisfaction score into 3 NPS classes
    def to_nps(score):
        if score == 5:
            return "Promoter"
        elif score == 4:
            return "Passive"
        else:
            return "Detractor"

    df["NPS"] = df["Satisfaction Score"].apply(to_nps)

    # columns that leak the answer - remove them
    leak = ["Satisfaction Score", "Churn Value", "Churn Score", "Churn Label",
            "Customer Status", "Churn Category", "Churn Reason"]
    df = df.drop(columns=leak)

    return df


# this part runs only when we run the file directly
if __name__ == "__main__":
    df = pd.read_csv("data/processed/merged.csv")
    df = build_target(df)
    df.to_csv("data/processed/data_with_target.csv", index=False)
    print("Saved. Shape:", df.shape)
    print(df["NPS"].value_counts())
