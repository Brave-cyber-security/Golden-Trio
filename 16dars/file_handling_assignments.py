import csv
import json

# 1


with open("data_sample.csv") as f:
    reader = csv.DictReader(f)
    csv_rows = list(reader)

print(f"Total rows: {len(csv_rows)}")


















# 2




total_age = sum(int(row['age']) for row in csv_rows)
average_age = total_age / len(csv_rows)
print(f"Average age: {average_age:.2f}")

# 3



# scores = [float(row['score']) for row in csv_rows]
# min_score = min(scores)
# max_score = max(scores)
# print(f"Minimum score: {min_score:.2f}")
# print(f"Maximum score: {max_score:.2f}")

# # 4


# print("\n" + "=" * 50)
# print("Assignment 4: First 5 users from JSON")
# print("=" * 50)

# with open("data_sample.json") as f:
#     data = json.load(f)

# users = data["users"]
# for i, user in enumerate(users[:5], 1):
#     print(f"{i}. ID: {user['id']}, Name: {user['name']}, Age: {user['age']}, Score: {user['score']:.2f}")

# # 5

# print("\n" + "=" * 50)
# print("Assignment 5: Users with score > 90")
# print("=" * 50)

# high_scorers = [u for u in users if float(u["score"]) > 90]
# print(f"{len(high_scorers)} users scored above 90")
# print("Sample (first 5):")
# for user in high_scorers[:5]:
#     print(f"  - {user['name']}: {user['score']:.2f}")

# # 6

# print("\n" + "=" * 50)

# print("Assignment 6: Users older than 40")
# print("=" * 50)

# older_than_40 = [u for u in users if int(u["age"]) > 40]
# print(f"{len(older_than_40)} users are older than 40")

# # 7

# print("\n" + "=" * 50)
# print("Assignment 7: Create CSV with age 25-35")
# print("=" * 50)

# age_filtered = [row for row in csv_rows if 25 <= int(row['age']) <= 35]
# with open("age_25_35.csv", "w", newline='') as f:
#     writer = csv.DictWriter(f, fieldnames=['id', 'name', 'age', 'score'])
#     writer.writeheader()
#     writer.writerows(age_filtered)

# print(f"Created 'age_25_35.csv' with {len(age_filtered)} users")

# # 8

# print("\n" + "=" * 50)
# print("Assignment 8: Users sorted by score (descending)")
# print("=" * 50)

# sorted_users = sorted(csv_rows, key=lambda x: float(x['score']), reverse=True)
# print("Top 5 users by score:")
# for i, user in enumerate(sorted_users[:5], 1):
#     print(f"{i}. {user['name']}: {float(user['score']):.2f}")

# # 9

# print("\n" + "=" * 50)
# print("Assignment 9: Top 10 users with highest scores")
# print("=" * 50)

# top_10 = sorted_users[:10]
# for i, user in enumerate(top_10, 1):
#     print(f"{i}. {user['name']}: {float(user['score']):.2f}")

# # 10

# print("\n" + "=" * 50)
# print("Assignment 10: Check if IDs match between CSV and JSON")
# print("=" * 50)

# csv_ids = set(int(row['id']) for row in csv_rows)
# json_ids = set(int(u['id']) for u in users)

# if csv_ids == json_ids:
#     print("✓ All IDs match between CSV and JSON!")
# else:
#     print("✗ IDs don't match")
#     only_csv = csv_ids - json_ids
#     only_json = json_ids - csv_ids
#     if only_csv:
#         print(f"  IDs only in CSV: {only_csv}")
#     if only_json:
#         print(f"  IDs only in JSON: {only_json}")

# # 11

# print("\n" + "=" * 50)
# print("Assignment 11: Average score per age group")
# print("=" * 50)

# age_groups = {
#     "18-25": [],
#     "26-35": [],
#     "36-45": [],
#     "46+": []
# }

# for row in csv_rows:
#     age = int(row['age'])
#     score = float(row['score'])
    
#     if 18 <= age <= 25:
#         age_groups["18-25"].append(score)
#     elif 26 <= age <= 35:
#         age_groups["26-35"].append(score)
#     elif 36 <= age <= 45:
#         age_groups["36-45"].append(score)
#     else:
#         age_groups["46+"].append(score)

# for group, scores in age_groups.items():
#     if scores:
#         avg = sum(scores) / len(scores)
#         print(f"Age group {group}: {avg:.2f} (count: {len(scores)})")
#     else:
#         print(f"Age group {group}: No data")

# # 12

# print("\n" + "=" * 50)
# print("Assignment 12: Convert JSON to CSV")
# print("=" * 50)

# with open("users_from_json.csv", "w", newline='') as f:
#     writer = csv.DictWriter(f, fieldnames=['id', 'name', 'age', 'score'])
#     writer.writeheader()
#     writer.writerows(users)

# print(f"Created 'users_from_json.csv' with {len(users)} users")

# # 13


# print("\n" + "=" * 50)
# print("Assignment 13: Detect inconsistencies between CSV and JSON")
# print("=" * 50)

# inconsistencies = []
# for csv_row in csv_rows:
#     csv_id = int(csv_row['id'])
#     json_user = next((u for u in users if int(u['id']) == csv_id), None)
    
#     if json_user:
#         if csv_row['name'] != json_user['name']:
#             inconsistencies.append(f"ID {csv_id}: Name mismatch")
#         if int(csv_row['age']) != int(json_user['age']):
#             inconsistencies.append(f"ID {csv_id}: Age mismatch")
#         if abs(float(csv_row['score']) - float(json_user['score'])) > 0.001:
#             inconsistencies.append(f"ID {csv_id}: Score mismatch")
#     else:
#         inconsistencies.append(f"ID {csv_id}: Not found in JSON")

# if inconsistencies:
#     print(f"Found {len(inconsistencies)} inconsistencies:")
#     for inc in inconsistencies[:10]: 
#         print(f"  - {inc}")
# else:
#     print("✓ No inconsistencies found! CSV and JSON data match perfectly.")

# #14

# print("\n" + "=" * 50)
# print("Assignment 14: Score distribution histogram")
# print("=" * 50)

# score_ranges = {
#     "0-20": 0,
#     "21-40": 0,
#     "41-60": 0,
#     "61-80": 0,
#     "81-100": 0
# }

# for row in csv_rows:
#     score = float(row['score'])
#     if 0 <= score <= 20:
#         score_ranges["0-20"] += 1
#     elif 21 <= score <= 40:
#         score_ranges["21-40"] += 1
#     elif 41 <= score <= 60:
#         score_ranges["41-60"] += 1
#     elif 61 <= score <= 80:
#         score_ranges["61-80"] += 1
#     elif 81 <= score <= 100:
#         score_ranges["81-100"] += 1

# print("\nScore Distribution:")
# for range_name, count in score_ranges.items():
#     bar = "█" * (count // 5) 
#     print(f"{range_name:8} [{count:3}] {bar}")

# print("\n" + "=" * 50)
# print("Assignment 15: Filter users starting with 'User1'")
# print("=" * 50)


# filtered_users = [u for u in users if u['name'].startswith('User1')]
# output_data = {"users": filtered_users}

# with open("users_starting_with_user1.json", "w") as f:
#     json.dump(output_data, f, indent=2)

# print(f"Created 'users_starting_with_user1.json' with {len(filtered_users)} users")
# print(f"Sample names: {', '.join([u['name'] for u in filtered_users[:5]])}")

# print("\n" + "=" * 50)
# print("ALL ASSIGNMENTS COMPLETED!")
# print("=" * 50)
