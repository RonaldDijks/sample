import numpy as np
import os

from keras.callbacks import ModelCheckpoint
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation


def create_model(n_labels):
    model = Sequential()

    model.add(Dense(256, input_shape=(40,)))
    model.add(Activation('relu'))
    model.add(Dropout(0.5))

    model.add(Dense(256))
    model.add(Activation('relu'))
    model.add(Dropout(0.5))

    model.add(Dense(n_labels))
    model.add(Activation('softmax'))

    model.compile(
        loss='categorical_crossentropy',
        metrics=['accuracy'],
        optimizer='adam'    
    )

    return model


def train_model(
    model, 
    X_train, 
    y_train, 
    X_test, 
    y_test,
    outdir,
    checkpoint_filename,
    model_filename,
    model_weights_filename,
    num_epochs=100, 
    num_batch_size=32
):
    checkpointer = ModelCheckpoint(
        filepath=os.path.join(outdir, checkpoint_filename),
        save_best_only=True,
        verbose=0
    )

    model.fit(
        X_train, 
        y_train, 
        batch_size=num_batch_size, 
        epochs=num_epochs,
        validation_data=(X_test, y_test),
        callbacks=[checkpointer],
        verbose=0
    )

    model_json = model.to_json()

    with open(os.path.join(outdir, model_filename), "w") as json_file:
        json_file.write(model_json)

    model.save_weights(os.path.join(outdir, model_weights_filename))