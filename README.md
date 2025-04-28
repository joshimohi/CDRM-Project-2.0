
## CDRM-Project  
 ![forthebadge](https://forthebadge.com/images/badges/uses-html.svg) ![forthebadge](https://forthebadge.com/images/badges/uses-css.svg) ![forthebadge](https://forthebadge.com/images/badges/uses-javascript.svg) ![forthebadge](https://forthebadge.com/images/badges/made-with-python.svg)  
  

## GITHUB EDITION
 > This version **DOES NOT** come with CDM's (Content Decryption Modules) or the link to automatically download them - A simple web search should help you find what you're looking for.
>

## Prerequisites  (from source only)
  
 - [Python](https://www.python.org/downloads/) version [3.12](https://www.python.org/downloads/release/python-3120/)+ with PIP and VENV installed  
  
   > Python 3.13 was used at the time of writing  

## Installation (Automatic) - Recommended   
- Extract contents of CDRM-Project 2.0 git contents into a new folder
- Open a terminal and change directory into the new folder
- Run `python main.py`
- Follow the on-screen prompts

## Installation (From binary)
- Download the latest release from the [releases](https://github.com/TPD94/CDRM-Project-2.0/releases) page and run the `.exe`

 ## Installation  (Manual)
 - Open your terminal and navigate to where you'd like to store the application  
 - Create a new python virtual environment using `python -m venv CDRM-Project`  
 - Change directory into the new `CDRM-Project` folder  
 - Activate the virtual environment  
  
   > Windows - change directory into the `Scripts` directory then `activate.bat`  
    >   
    > Linux - `source bin/activate`  
  
 - Extract CDRM-Project 2.0 git contents into the newly created `CDRM-Project` folder  
 - Install python dependencies `pip install -r requirements.txt`  
 - (Optional) Create the folder structure `/configs/CDMs/WV` and place your .WVD file into `/configs/CDMs/WV`  
 - (Optional) Create the folder structure `/config/CDMs/PR` and place your .PRD file into `/configs/CDMs/PR`  
 - Run the application with `python main.py`
