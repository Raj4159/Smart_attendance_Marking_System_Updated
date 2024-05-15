import os
import string
import urllib
import uuid
import pickle
import datetime
import time
import shutil
import threading
import numpy as np
import cv2
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import FileResponse
from fastapi import responses
from fastapi.middleware.cors import CORSMiddleware
import starlette
import face_recognition

ATTENDANCE_LOG_DIR = './logs'
DB_PATH = './db'

for dir_ in [ATTENDANCE_LOG_DIR, DB_PATH]:
    if not os.path.exists(dir_):
        os.mkdir(dir_)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a global variable to store the recognized user names
global recognized_user_names
recognized_user_names = []

# Load known face encodings and names from the database folder
def load_known_faces():
    known_face_encodings = []
    known_face_names = []

    db_files = [f for f in os.listdir(DB_PATH) if f.endswith('.pickle')]

    for db_file in db_files:
        with open(os.path.join(DB_PATH, db_file), 'rb') as f:
            data = pickle.load(f)
            known_face_encodings.append(data[0])
            known_face_names.append(db_file[:-7])  # Remove the '.pickle' extension

    return known_face_encodings, known_face_names




# Mark attendance for recognized users
# def mark_attendance(user_names):
#     if not user_names:
#         return  # No recognized faces, no attendance to mark

#     epoch_time = time.time()
#     date = time.strftime('%Y%m%d', time.localtime(epoch_time))

#     csv_file_path = os.path.join(ATTENDANCE_LOG_DIR, '{}.csv'.format(date))
#     # Check if the CSV file exists, if not create it and add the header
#     if not os.path.exists(csv_file_path):
#         with open(csv_file_path, 'w') as f:
#             f.write('Name,Time,Status\n')

#     # Read existing names from the CSV file to avoid duplication
#     existing_names = set()
#     with open(csv_file_path, 'r') as f:
#         lines = f.readlines()
#         for line in lines[1:]:  # Skip the header
#             name, _, _ = line.strip().split(',')
#             existing_names.add(name)

#     # Append new attendance records for each recognized user
#     with open(csv_file_path, 'a') as f:
#         for user_name in user_names:
#             if user_name not in existing_names:
#                 f.write('{},{},{}\n'.format(user_name, datetime.datetime.now(), 'Present'))

def mark_attendance(user_names):
    if not user_names:
        return  # No recognized faces, no attendance to mark

    # Get the current date
    current_date = datetime.datetime.now().strftime('%d-%m-%Y')

    # Iterate over each user ID
    for user_name in user_names:
        # Path for the individual CSV file for the user
        csv_file_path = os.path.join(ATTENDANCE_LOG_DIR, '{}.csv'.format(user_name))
        
        # Check if the CSV file exists for the current date
        if os.path.exists(csv_file_path):
            with open(csv_file_path, 'r') as f:
                # Read the last line of the CSV file
                lines = f.readlines()
                last_line = lines[-1].strip().split(',')
                last_date = last_line[0]  # Date of the last entry
                if last_date == current_date:
                    # Attendance already marked for today, skip marking
                    continue
        
        # Attendance for today has not been marked, so mark it
        with open(csv_file_path, 'a') as f:
            f.write('{},{},{}\n'.format(current_date, datetime.datetime.now().strftime('%H:%M:%S'), 'Present'))
                
                
                

# Recognize faces in real-time and display
def recognize_with_display():
    # Load known faces from the database
    known_face_encodings, known_face_names = load_known_faces()

    # Get a reference to webcam
    video_capture = cv2.VideoCapture(0)

    while True:
        # Grab a single frame of video
        ret, frame = video_capture.read()

        if not ret:
            continue

        # Convert the image from BGR color to RGB color
        rgb_frame = frame[:, :, ::-1]

        # Find all the faces and face encodings in the frame of video
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        # Loop through each face in this frame of video
        recognized_user_names = []
        for face_encoding, face_location in zip(face_encodings, face_locations):
            if face_location:  # Check if face_location is not empty
                # Compare the face with known faces
                matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
                name = "Unknown"

                # Find the best match
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                best_match_index = np.argmin(face_distances)

                if matches[best_match_index]:
                    name = known_face_names[best_match_index]
                    recognized_user_names.append(name)

                # Draw a box around the face
                top, right, bottom, left = face_location
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                # Draw a label with a name below the face
                # cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255))
                font = cv2.FONT_HERSHEY_DUPLEX
                cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

        # Mark attendance for recognized users
        mark_attendance(recognized_user_names)

        # Display the resulting image
        cv2.imshow('Video', frame)

        # Hit 'q' on the keyboard to quit!
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release handle to the webcam
    video_capture.release()
    cv2.destroyAllWindows()
    


@app.get("/login")
async def login():

    recognize_with_display()
    
    return {'Successfully Marked attendance'}




@app.post("/register_new_user")
async def register_new_user(file: UploadFile = File(...), text=Form(...)):
    file.filename = f"{uuid.uuid4()}.png"
    contents = await file.read()

    with open(file.filename, "wb") as f:
        f.write(contents)

    shutil.copy(file.filename, os.path.join(DB_PATH, '{}.png'.format(text)))

    embeddings = face_recognition.face_encodings(cv2.imread(file.filename))

    file_ = open(os.path.join(DB_PATH, '{}.pickle'.format(text)), 'wb')
    pickle.dump(embeddings, file_)
    print(file.filename, text)

    os.remove(file.filename)

    return {'registration_status': 'Registered successfully'}




@app.get("/get_attendance_logs")
async def get_attendance_logs():
    filename = 'out.zip'
    shutil.make_archive(filename[:-4], 'zip', ATTENDANCE_LOG_DIR)

    return starlette.responses.FileResponse(filename, media_type='application/zip', filename=filename)





if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)