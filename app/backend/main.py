import librosa
import pandas as pd
import numpy as np
import os
import sys
import json
import glob

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
from librosa.feature import spectral_centroid
from librosa.util import fix_length


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

    y, sr = librosa.load(file_path, res_type='kaiser_fast')

    prediction_feature = np.array([get_mfcc(y, sr)])

    predicted_proba_vector = model.predict_proba(prediction_feature)
    predicted_proba = predicted_proba_vector[0]

    fixed_size  = 44100

    centroid = spectral_centroid(y=y, sr=sr)
    frequency = np.average(centroid)

    centroid = fix_length(centroid, size=fixed_size)

    length = librosa.get_duration(y=y, sr=sr)

    result = {
        'file_path': file_path,
        'classes': {},
        'position': {
            'frequency': frequency,
            'length': length
        }
    }

    for i in range(len(predicted_proba)):
        category = label_encoder.inverse_transform(np.array([i]))
        result['classes'][category[0]] = format(predicted_proba[i], '.32f')

    return result


def predict_many(files):
    output = []
    
    for file in files:
        output.append(predict(file))

    return output


def predict_folder(path):
    pathname = os.path.join(path, '**', '*.wav')
    files = glob.glob(pathname, recursive=True)
    return predict_many(files)


def labels():
    classes = np.load(os.path.join(outdir, encoder_filename))
    classes_json = json.dumps(classes.tolist())
    print(classes_json)


parser = argparse.ArgumentParser()

subparsers = parser.add_subparsers(title='commands', dest='command', help='command')

train_command = subparsers.add_parser('train', help='Train the neural network.')

predict_command = subparsers.add_parser('predict', help='Predict the labels for a given sample.')
predict_command.add_argument('file', action='store', help='The file to predict for.')

predict_many_command = subparsers.add_parser('predict_many', help="Predict for all given samples.")
predict_many_command.add_argument('files', nargs='+', action='store', help='A list of files to predict for.')

predict_folder_command = subparsers.add_parser('predict_folder', help="Predict for all given samples.")
predict_folder_command.add_argument('folder', action='store', help='A list of files to predict for.')

label_command = subparsers.add_parser('labels', help="Return all the network's labels.")

args = parser.parse_args()

if args.command == 'train':
    train()
elif args.command == 'predict':
    print(json.dumps(predict(args.file)))
elif args.command == 'predict_many':
    print(json.dumps(predict_many(args.files)))
elif args.command == 'predict_folder':
    print(json.dumps(predict_folder(args.folder)))
elif args.command == 'labels':
    labels()
