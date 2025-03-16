import pandas as pd
import json

# Read the Excel file
excel_file = 'attached_assets/Difficulty ranking UKMLA Excel.xlsx'
xl = pd.ExcelFile(excel_file)

# Get all sheet names
sheets = xl.sheet_names

# Create a structure to hold our analysis
analysis = {
    'sheets': [],
    'sample_data': {}
}

# Analyze each sheet
for sheet in sheets:
    df = pd.read_excel(excel_file, sheet_name=sheet)
    
    # Get column names
    columns = df.columns.tolist()
    
    # Get first few rows as sample
    sample = df.head(3).to_dict('records')
    
    sheet_info = {
        'name': sheet,
        'columns': columns,
        'row_count': len(df),
    }
    
    analysis['sheets'].append(sheet_info)
    analysis['sample_data'][sheet] = sample

# Print the analysis
print("\nExcel File Analysis:")
print("===================")
print(f"Total Sheets: {len(sheets)}")
print("\nSheet Details:")
for sheet in analysis['sheets']:
    print(f"\nSheet: {sheet['name']}")
    print(f"Columns: {', '.join(sheet['columns'])}")
    print(f"Total Rows: {sheet['row_count']}")
    print("\nSample Data:")
    print(json.dumps(analysis['sample_data'][sheet['name']], indent=2))
