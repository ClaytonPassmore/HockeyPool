import flask

app = flask.Flask(__name__)

@app.route('/draft')
def draft():
    return flask.render_template('draft.html')

@app.route('/')
def root():
    return "In progress"


if __name__ == '__main__':
    app.run()
