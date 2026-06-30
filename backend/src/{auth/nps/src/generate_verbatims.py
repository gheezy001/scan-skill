# Day 11: seeded generator for synthetic customer verbatims (reproducible, no leakage).
import random
import pandas as pd

frustrated = [
    "Called again about my bill being higher than expected.",
    "Internet keeps dropping in the evenings, very annoying.",
    "Still waiting for someone to fix my connection issue.",
    "Thinking about switching, the service is not worth the price.",
    "Support was slow and did not solve my problem.",
]
neutral = [
    "Asked a question about my current plan.",
    "Wanted to check what offers are available.",
    "Called to update my payment details.",
    "Routine question about my monthly charges.",
    "Asked how to add a new service.",
]
happy = [
    "Just wanted to say the new plan works great.",
    "Happy with the service, no issues at all.",
    "The support team was helpful and quick.",
    "Recommended the company to a friend recently.",
    "Everything is working well, thanks.",
]


def make_note(row, idx):
    rng = random.Random(42 + idx)
    risk = 0
    if row["Contract"] == "Month-to-Month":   risk += 1
    if row["is_new_customer"] == 1:           risk += 1
    if row["Internet Type"] == "Fiber Optic": risk += 1
    if row["Monthly Charge"] > 80:            risk += 1
    if rng.random() < 0.20:
        risk = rng.choice([0, 1, 2, 3, 4])
    if risk >= 3:
        bank = frustrated
    elif risk <= 1:
        bank = happy
    else:
        bank = neutral
    return rng.choice(bank)


def add_verbatims(data):
    data["verbatim"] = [make_note(row, i) for i, row in data.iterrows()]
    return data


if __name__ == "__main__":
    data = pd.read_csv("data/processed/data_features.csv")
    data = add_verbatims(data)
    data.to_csv("data/processed/data_verbatims.csv", index=False)
    print("Saved. Unique notes:", data["verbatim"].nunique())
