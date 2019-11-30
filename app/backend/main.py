import pandas as pd
import numpy as np
import os

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from keras.utils import to_categorical

from feature_extraction import extract_features
from model import create_model, train_model

sample_csv = pd.read_csv("C:/dev/school/samples.csv")
features = extract_features(sample_csv)

X = np.array(features.feature.tolist())
labels = np.array(features.label.tolist())

print("Finished extracting features.")

label_encoder = LabelEncoder()
y = to_categorical(label_encoder.fit_transform(labels))

print("Finished encoding labels.")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

print("Finished splitting input set into test and train sets.")

model = create_model(n_labels=y.shape[1])

print(model.evaluate(X_train, y_train, verbose=0))

print("Finished creating model.")

outdir = os.path.join(os.getcwd(), "out")

if not os.path.exists(outdir):
    os.makedirs(outdir)

filepath = os.path.join(outdir, "weights.best.basic_mlp.hdf5")

train_model(model, X_train, y_train, X_test, y_test, filepath)

print(model.evaluate(X_train, y_train, verbose=0))

print("Finished training model.")

new_model = create_model(n_labels=y.shape[1])

new_model.load_weights(filepath)

print(new_model.evaluate(X_train, y_train, verbose=0))

print("Finished loading weights.")