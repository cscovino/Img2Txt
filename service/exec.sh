#!/bin/sh
cd ../localization
python3 localization.py
cd ../crop
python3 cropDir.py
cd ../transcript
python3 transcript.py
cd ../service
