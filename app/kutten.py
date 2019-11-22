import argparse
from datetime import datetime 
import json
from keras.callbacks import ModelCheckpoint 
from keras.models import model_from_json
from keras.models import load_model
from keras.utils import to_categorical
import librosa
import numpy as np
import pandas as pd
from pathlib import Path
from scipy.io import wavfile as wav
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

def extract_features(file_name):
    try:
        audio, sample_rate = librosa.load(file_name, res_type='kaiser_fast')
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
        stft = np.abs(librosa.stft(audio))
        chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)
        mfccsscaled = np.mean(mfccs.T, axis=0)
    except Exception as e:
        print("Error encountered while parsing file:", file_name)
        return None
    
    return mfccsscaled, chroma

metadata = pd.read_csv('C:/dev/school/samples.csv')

features = []

for index, row in metadata.iterrows():
    
    file_name = str(row["path"])
    class_label = row[1]
    data, data2 = extract_features(file_name)
    #print(data)
    features.append([data, class_label])
    print(data2)

featuresdf = pd.DataFrame(features, columns=['feature','class_label'])

# Convert features to numpy arrays
X = np.array(featuresdf.feature.tolist())
y = np.array(featuresdf.class_label.tolist())

le = LabelEncoder()
yy = to_categorical(le.fit_transform(y))

x_train, x_test, y_train, y_test = train_test_split(X, yy, test_size=0.2, random_state = 10)

num_epochs = 100
num_batch_size = 32

checkpointer = ModelCheckpoint(filepath='weights.best.basic_mlp.hdf5', 
                               verbose=1, save_best_only=True)


model = load_model('weights.best.basic_mlp.hdf5')

model.compile(loss='categorical_crossentropy', metrics=['accuracy'], optimizer='adam')

model.summary()

def extract_feature(file):
   
    try:
        audio_data, sample_rate = librosa.load(file, res_type='kaiser_fast') 
        mfccs = librosa.feature.mfcc(y=audio_data, sr=sample_rate, n_mfcc=40)
        mfccsscaled = np.mean(mfccs.T,axis=0)
        
    except Exception as e:
        print("Error encountered while parsing file: ", file)
        return None, None

    return np.array([mfccsscaled])

def print_prediction(file_name):
    prediction_feature = extract_feature(file_name) 

    predicted_vector = model.predict_classes(prediction_feature)
    predicted_class = le.inverse_transform(predicted_vector) 
    print(le.inverse_transform(predicted_vector))
    print("The predicted class is:", predicted_class[0], '\n') 

    predicted_proba_vector = model.predict_proba(prediction_feature) 
    predicted_proba = predicted_proba_vector[0]
    for i in range(len(predicted_proba)): 
        category = le.inverse_transform(np.array([i]))
        print(category[0], "\t\t : ", format(predicted_proba[i], '.32f') )

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
        print_prediction(file)

    

if __name__ == "__main__":
    main()