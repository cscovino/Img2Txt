#!/bin/sh
cd localization
python3 localization.py
cd ..
cd crop
python3 cropDir.py
cd ..
cd transcript
python3 transcript.py
