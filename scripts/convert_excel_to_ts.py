import pandas as pd
import json

def clean_subject_name(name: str) -> str:
    return name.strip().rstrip(':')

def process_sheet(df: pd.DataFrame) -> dict:
    # Get the subject name from the first row
    subject_name = clean_subject_name(df.iloc[0, 0])
    
    # Skip the header row and process topics
    topics = []
    for _, row in df.iloc[1:].iterrows():
        if pd.notna(row.iloc[0]) and pd.notna(row.iloc[1:]).all():
            topic = {
                "name": row.iloc[0].strip(),
                "ratings": {
                    "difficulty": int(row.iloc[1]),
                    "clinicalImportance": int(row.iloc[2]),
                    "examRelevance": int(row.iloc[3])
                }
            }
            topics.append(topic)
    
    return {
        "name": subject_name,
        "topics": topics
    }

def convert_excel_to_ts():
    # Read the Excel file
    excel_file = 'attached_assets/Difficulty ranking UKMLA Excel.xlsx'
    xl = pd.ExcelFile(excel_file)
    
    subjects_data = []
    
    # Process each sheet except 'Export Summary'
    for sheet_name in xl.sheet_names:
        if sheet_name != 'Export Summary':
            df = pd.read_excel(excel_file, sheet_name=sheet_name)
            if not df.empty:
                subject_data = process_sheet(df)
                if subject_data["topics"]:  # Only add if there are topics
                    subjects_data.append(subject_data)
    
    # Create TypeScript output
    ts_output = f"""
export interface TopicRating {{
  difficulty: number;
  clinicalImportance: number;
  examRelevance: number;
}}

export interface Topic {{
  name: string;
  ratings: TopicRating;
}}

export interface Subject {{
  name: string;
  topics: Topic[];
}}

export type SubjectsData = Subject[];

const masterSubjects: SubjectsData = {json.dumps(subjects_data, indent=2)};

export default masterSubjects;
"""
    
    # Write to TypeScript file
    with open('client/src/data/masterSubjects.ts', 'w') as f:
        f.write(ts_output)

if __name__ == "__main__":
    convert_excel_to_ts()
