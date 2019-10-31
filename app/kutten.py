import argparse
import json
from pathlib import Path
import librosa
from scipy.io import wavfile as wav
import numpy as np

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
        default=Path(__file__).absolute().parent / "data",
        help="Path to the data directory",
        required=True
    )

    args = parser.parse_args()

    files = [x for x in args.data_dir.glob("**/*.wav") if x.is_file()]

    for file in files:
        process(file)

if __name__ == "__main__":
    main()