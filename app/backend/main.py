import pandas as pd
import numpy as np
import os
import sys
import json

stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import logging
logging.getLogger('tensorflow').disabled = True

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from keras.models import model_from_json
from keras.utils import to_categorical
sys.stderr = stderr

from feature_extraction import extract_features, get_mfcc
from model import create_model, train_model

import argparse

outdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "out")
checkpoint_filename = "weights.best.basic_mlp.hdf5"
model_filename = "model.json"
model_weights_filename = "model.weights.hdf5"
encoder_filename = 'classes.npy'

def train():

    sample_csv = pd.read_csv("C:/dev/school/samples.csv")
    features = extract_features(sample_csv)

    X = np.array(features.feature.tolist())
    labels = np.array(features.label.tolist())

    print("Finished extracting features.")

    label_encoder = LabelEncoder()
    y = to_categorical(label_encoder.fit_transform(labels))
    np.save(os.path.join(outdir, encoder_filename), label_encoder.classes_)

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


def predict(file):

    label_encoder = LabelEncoder()
    label_encoder.classes_ = np.load(os.path.join(outdir, encoder_filename))

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

    file_path = os.path.join(os.getcwd(), file)

    prediction_feature = np.array([get_mfcc(file_path)])

    predicted_proba_vector = model.predict_proba(prediction_feature)
    predicted_proba = predicted_proba_vector[0]

    result = {
        'file_path': file_path,
        'classes': {}
    }

    for i in range(len(predicted_proba)):
        category = label_encoder.inverse_transform(np.array([i]))
        result['classes'][category[0]] = format(predicted_proba[i], '.32f')

    print(json.dumps(result))

def labels():
    classes = np.load(os.path.join(outdir, encoder_filename))
    classes_json = json.dumps(classes.tolist())
    print(classes_json)

parser = argparse.ArgumentParser()

subparsers = parser.add_subparsers(title='commands', dest='command', help='command')

train_command = subparsers.add_parser('train', help='Train the neural network.')

predict_command = subparsers.add_parser('predict', help='Predict the labels for a given sample.')
predict_command.add_argument('file', action='store', help='The file to predict for.')

label_command = subparsers.add_parser('labels', help="Return all the network's labels.")

args = parser.parse_args()

if args.command == 'train':
    train()
elif args.command == 'predict':
    predict(args.file)
elif args.command == 'labels':
    labels()
