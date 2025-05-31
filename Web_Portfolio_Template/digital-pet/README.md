# 🐶 Python OOP Challenge – Digital Pet

Welcome to the Python OOP Challenge! This project showcases a **Digital Pet** built using Object-Oriented Programming concepts in Python. It’s a fun way to understand how classes, attributes, and methods work in a real-world example. 🎯

---

## 📁 Project Structure

📦 digital-pet/ 
-    ├── pet.py # Contains the Pet class definition 
-    ├── main.py # Script to create and interact with the Pet object 
-    └── README.md # This documentation file
-    
---

## Features

The `Pet` class includes:

- **Attributes**
  - `name` – Pet’s name
  - `hunger` – Level of hunger (0–10)
  - `energy` – Energy level (0–10)
  - `happiness` – Happiness level (0–10)
  - `tricks` – List of learned tricks

- **Methods**
  - `eat()` – Reduces hunger, boosts happiness
  - `sleep()` – Restores energy
  - `play()` – Uses energy, raises happiness, increases hunger
  - `get_status()` – Displays current pet status
  - `train(trick)` – Teaches a new trick
  - `show_tricks()` – Shows all learned tricks

---

## ▶️ Getting Started

### Prerequisites

- Python 3.x

### How to Run

```bash
# Clone the repo or download the ZIP
git clone https://github.com/KabeloMatlakala/PLP-Digital-Pet.git
cd PLP-Digital-Pet

# Run the main script
python main.py
