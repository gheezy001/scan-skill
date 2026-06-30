# Day 4: choose columns, separate X and y, and split into train / test.
import pandas as pd
from sklearn.model_selection import train_test_split

drop_cols = ["Customer ID", "Country", "State", "City", "Zip Code",
             "Lat Long", "Latitude", "Longitude", "Population"]


def split_data(data):
    model_data = data.drop(columns=drop_cols)
    X = model_data.drop(columns=["NPS"])
    y = model_data["NPS"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=y)
    return X_train, X_test, y_train, y_test


# this part runs only when we run the file directly
if __name__ == "__main__":
    data = pd.read_csv("data/processed/data_features.csv")
    X_train, X_test, y_train, y_test = split_data(data)

    # save train and test as files (target column included)
    train = X_train.copy()
    train["NPS"] = y_train
    test = X_test.copy()
    test["NPS"] = y_test
    train.to_csv("data/processed/train.csv", index=False)
    test.to_csv("data/processed/test.csv", index=False)

    print("train:", train.shape)
    print("test: ", test.shape)
