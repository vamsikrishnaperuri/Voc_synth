from flask import Flask, request
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    print(request.form["audiofile"])
    if 'audiofile' not in request.form:
        print("Not file selected")
        return 'No file part'

    file = request.form['audiofile']
    # print(file)
    # if file:
    #     filename = secure_filename(file.filename)
    #     file.save(os.path.join('flaskupload', filename))
    #     return 'File uploaded successfully'

if __name__ == '__main__':
    app.run(debug=True,)