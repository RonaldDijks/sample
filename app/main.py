import os
import json
import librosa
import argparse
from pathlib import Path

defaultDataDir = Path(__file__).absolute().parent / "data"

def process(file):
    path = file.resolve()
    _, samplerate = librosa.load(path)

    obj = { "path": str(path), "samplerate": samplerate }
    print(json.dumps(obj))
    
def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--data_dir",
        type=Path,
        default=defaultDataDir,
        help="Path to the data directory",
        required=True
    )

    args = parser.parse_args()

    files = [x for x in args.data_dir.glob("**/*.wav") if x.is_file()]

    for file in files:
        process(file)        
   
if __name__ == "__main__":
    main()