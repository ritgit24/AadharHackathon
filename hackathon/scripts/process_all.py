import pandas as pd
import os
import glob


DATA_DIR = 'data'
OUTPUT_FILE = 'public/summary.json'

all_enrolment_frames = []
all_demographic_frames = []

csv_files = glob.glob(os.path.join(DATA_DIR, '**/*.csv'), recursive=True)

print(f"Found {len(csv_files)} CSV files. Processing...")

for file in csv_files:
    df = pd.read_csv(file)
    

    cols = df.columns.tolist()
    
    if 'age_18_greater' in cols:
        print(f"Processing Enrolment file: {file}")
        # Group by state immediately to save memory
        summary = df.groupby('state')[['age_0_5', 'age_5_17', 'age_18_greater']].sum()
        all_enrolment_frames.append(summary)
        
    elif 'demo_age_17_' in cols:
        print(f"Processing Demographic file: {file}")
        summary = df.groupby('state')[['demo_age_5_17', 'demo_age_17_']].sum()
        all_demographic_frames.append(summary)


final_enrolment = pd.concat(all_enrolment_frames).groupby(level=0).sum()
final_demographic = pd.concat(all_demographic_frames).groupby(level=0).sum()

final_data = final_enrolment.join(final_demographic, how='outer').fillna(0).reset_index()


final_data.to_json(OUTPUT_FILE, orient='records')
print(f"Successfully created {OUTPUT_FILE}")