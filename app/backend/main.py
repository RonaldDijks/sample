import pandas as pd
import numpy as np
import os

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from keras.models import model_from_json
from keras.utils import to_categorical

from feature_extraction import extract_features
from model import create_model, train_model

import argparse

outdir = os.path.join(os.getcwd(), "out")
checkpoint_filename = "weights.best.basic_mlp.hdf5"
model_filename = "model.json"
model_weights_filename = "model.weights.hdf5"

def train():

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

    if not os.path.exists(outdir):
        os.makedirs(outdir)

    train_model(
        model, 
        X_train, 
        y_train, 
        X_test, 
        y_test, 
        outdir, 
        checkpoint_filename, 
        model_filename, 
        model_weights_filename
    )

    print(model.evaluate(X_train, y_train, verbose=0))

    print("Finished training model.")


def predict():

    model_json_handle = open(os.path.join(outdir, model_filename), "r")
    model_json = model_json_handle.read()
    model_json_handle.close()

    model = model_from_json(model_json)

    model.load_weights(os.path.join(outdir, model_weights_filename))

    model.compile(
        loss='categorical_crossentropy',
        metrics=['accuracy'],
        optimizer='adam'    
    )

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

    print(model.evaluate(X_train, y_train, verbose=0))

    print("Finished loading weights.")

commands = {
    'train': train,
    'predict': predict
}

parser = argparse.ArgumentParser()

parser.add_argument('command', choices=commands.keys())

args = parser.parse_args()

commands[args.command]()