#!/usr/bin/env python3
"""
Simple Folder Map Generator
"""

import os
import sys

def generate_simple_folder_map(path=".", prefix="", show_hidden=False):
    """Generate a simple folder map."""
    items = []
    
    try:
        items = os.listdir(path)
    except PermissionError:
        return f"{prefix}[Permission denied]"
    
    # Filter hidden files if needed
    if not show_hidden:
        items = [item for item in items if not item.startswith('.')]
    
    # Sort items (directories first, then files)
    dirs = []
    files = []
    
    for item in items:
        item_path = os.path.join(path, item)
        if os.path.isdir(item_path):
            dirs.append(item)
        else:
            files.append(item)
    
    items_sorted = sorted(dirs) + sorted(files)
    
    output = []
    
    for i, item in enumerate(items_sorted):
        item_path = os.path.join(path, item)
        is_last = (i == len(items_sorted) - 1)
        
        if os.path.isdir(item_path):
            # Directory
            connector = "└── " if is_last else "├── "
            output.append(f"{prefix}{connector}📁 {item}/")
            
            # Recursive call for subdirectories
            new_prefix = prefix + ("    " if is_last else "│   ")
            sub_output = generate_simple_folder_map(item_path, new_prefix, show_hidden)
            if sub_output:
                output.append(sub_output)
        else:
            # File
            connector = "└── " if is_last else "├── "
            output.append(f"{prefix}{connector}📄 {item}")
    
    return "\n".join(output)


if __name__ == "__main__":
    # Get path from command line or use current directory
    path = sys.argv[1] if len(sys.argv) > 1 else "."
    
    print(f"Folder Map: {os.path.abspath(path)}")
    print("=" * 50)
    print()
    
    try:
        folder_map = generate_simple_folder_map(path)
        print(folder_map)
    except FileNotFoundError:
        print(f"Error: Path '{path}' not found")
    except Exception as e:
        print(f"Error: {e}")