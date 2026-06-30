# Customer NPS Prediction

One notebook builds the whole project. As each day works, its code is saved into
`src/` with a `%%writefile` cell. The app (built later) uses those files.

## Folders
- `nps_project.ipynb` - the project, day by day
- `data/raw/` - put the 5 Cognos files + the simple CSV here
- `data/processed/` - merged / cleaned data is saved here
- `src/` - code saved from the notebook (load_data.py, ...)
- `app/` - the Streamlit app (built later)
- `models/` - the saved model (built later)

## Setup
pip install -r requirements.txt

## How to run
Open `nps_project.ipynb` and run the cells from top to bottom.
Run everything from the project folder (so paths like data/raw/... work).
