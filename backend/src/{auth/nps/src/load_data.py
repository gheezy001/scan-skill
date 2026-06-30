# load the 5 Cognos files and merge them into one table.
import pandas as pd


def load_data():
    # Read the 5 files
    status       = pd.read_excel("data/raw/Telco_customer_churn_status.xlsx")
    services     = pd.read_excel("data/raw/Telco_customer_churn_services.xlsx")
    demographics = pd.read_excel("data/raw/Telco_customer_churn_demographics.xlsx")
    location     = pd.read_excel("data/raw/Telco_customer_churn_location.xlsx")
    population   = pd.read_excel("data/raw/Telco_customer_churn_population.xlsx")

    # Remove columns that are the same for every customer (no information)
    status       = status.drop(columns=["Count", "Quarter"])
    services     = services.drop(columns=["Count", "Quarter"])
    demographics = demographics.drop(columns=["Count"])
    location     = location.drop(columns=["Count"])
    population   = population.drop(columns=["ID"])

    # Merge the customer files on "Customer ID"
    df = status.merge(services, on="Customer ID")
    df = df.merge(demographics, on="Customer ID")
    df = df.merge(location, on="Customer ID")

    # Add the population of each customer's zip code
    df = df.merge(population, on="Zip Code")

    # Convert "Total Charges" into a numerical format
    df["Total Charges"] = pd.to_numeric(df["Total Charges"], errors="coerce")

    return df


# this part runs only when we run the file directly
if __name__ == "__main__":
    df = load_data()
    df.to_csv("data/processed/merged.csv", index=False)
    print("Merged shape:", df.shape)
