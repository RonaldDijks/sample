import pandas as pd
import numpy as np
import os
import librosa
from pprint import pprint 


def get_mfcc(y, sr, n_features=40):
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_features)
    return np.mean(mfccs.T, axis=0)


def extract_features(csv):
    features = []
    for _, row in csv.iterrows():
        data = get_mfcc(row[0])
        features.append([data, row[1]])
    return pd.DataFrame(features, columns=['feature', 'label'])
