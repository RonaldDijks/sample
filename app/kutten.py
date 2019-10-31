import argparse
import json
from pathlib import Path
    
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
    
    files = [{ "path": str(x.resolve()) } for x in args.data_dir.glob("**/*.wav") if x.is_file()]
    
    print(json.dumps(files))


if __name__ == "__main__":
    main()