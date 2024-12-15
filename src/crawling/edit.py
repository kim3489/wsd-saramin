import csv
import os
import pandas as pd

input_file = os.path.join(os.getcwd(),"job.csv")
output_file = os.path.join(os.getcwd(),"jobEdit.csv")

df = pd.read_csv(input_file, encoding="utf-8")
df = df.drop_duplicates(subset=["title", "link"], keep="first")
duplication_file = os.path.join(os.getcwd(),"duplication.csv")
df.to_csv(duplication_file, index=False, encoding="utf-8")

def extract_register_date(data):
    if "등록일" in data:
        parts = data.split("등록일")
        return parts[0].strip(), "등록일" + parts[1].strip() if len(parts) > 1 else ""
    if "수정일" in data:
        parts = data.split("수정일")
        return parts[0].strip(), "수정일" + parts[1].strip() if len(parts) > 1 else ""
    return data, ""

def extract_data(data):
    if ", 외" in data:
        return data
    if " 외" in data:
        return data.split(" 외")[0].strip()
    return data

with open(duplication_file, mode="r", encoding="utf-8") as infile, open(output_file, mode="w", encoding="utf-8", newline="") as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    headers = next(reader)
    headers.append("createdAt")
    writer.writerow(headers)

    for row in reader:
        if len(row) > 8:
            original_data = row[8]

            remaining_data, register_date = extract_register_date(original_data)

            clean_data = extract_data(remaining_data)

            row[8] = clean_data
            row.append(register_date)

        writer.writerow(row)

print("데이터 처리가 완료되었습니다!")