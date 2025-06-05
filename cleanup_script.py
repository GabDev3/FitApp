import os
import re

def remove_comments_and_logs(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Remove Python comments
        if file_path.endswith('.py'):
            content = re.sub(r'#.*', '', content)

        # Remove JavaScript/JSX comments and console.log statements
        if file_path.endswith('.jsx') or file_path.endswith('.js'):
            content = re.sub(r'//.*', '', content)  # Remove single-line comments
            content = re.sub(r'/\*[\s\S]*?\*/', '', content)  # Remove multi-line comments
            content = re.sub(r'console\.log\(.*?\);?', '', content)  # Remove console.log statements

        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
    except UnicodeDecodeError as e:
        print(f"Error reading file {file_path}: {e}")

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.py') or file.endswith('.jsx') or file.endswith('.js'):
                file_path = os.path.join(root, file)
                remove_comments_and_logs(file_path)

# Run cleanup for both frontend and backend directories
process_directory('backend')