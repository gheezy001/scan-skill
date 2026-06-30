# fill structural missing values and build new features.
import pandas as pd

service_cols = ["Phone Service", "Multiple Lines", "Online Security", "Online Backup",
                "Device Protection Plan", "Premium Tech Support", "Streaming TV",
                "Streaming Movies", "Streaming Music", "Unlimited Data"]


def add_features(data):
    # missing here means "no offer" / "no internet", not a random gap
    data["Offer"] = data["Offer"].fillna("None")
    data["Internet Type"] = data["Internet Type"].fillna("No internet")

    # number of services the customer has
    data["num_services"] = (data[service_cols] == "Yes").sum(axis=1)

    # charge per service (add 1 so we never divide by zero)
    data["charge_per_service"] = data["Monthly Charge"] / (data["num_services"] + 1)

    # new customer flag (12 months or less)
    data["is_new_customer"] = (data["Tenure in Months"] <= 12).astype(int)

    # auto-pay flag
    data["is_autopay"] = (data["Payment Method"] == "Bank Withdrawal").astype(int)

    return data


# this part runs only when we run the file directly
if __name__ == "__main__":
    data = pd.read_csv("data/processed/data_with_target.csv")
    data = add_features(data)
    data.to_csv("data/processed/data_features.csv", index=False)
    print("Saved. Shape:", data.shape)
