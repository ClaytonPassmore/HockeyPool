import flask


class BaseHandler(object):
    request = flask.request

    def post(self):
        self.abort(404)

    def get(self):
        self.abort(404)

    def render_template(self, *args):
        return flask.render_template(*args)

    def abort(self, code):
        flask.abort(code)

    def make_response(self, response, status=200, headers={}):
        return flask.make_response(response, status, headers)
