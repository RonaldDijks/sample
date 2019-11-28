import pandas as pd
import os
import librosa
from pprint import pprint

# samplespath = 'C:/Users/Sil/Documents/Ableton/User Library/Samples/'

def extract_features(file_name, n_features):
    audio, sample_rate = librosa.load(file_name, res_type='kaiser_fast')
    mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=n_features)
    return np.mean(mfccs.T, axis=0)


sample_csv = pd.read_csv("C:/dev/school/samples.csv")

for index, row in sample_csv.iterrows():

    print(row.path)