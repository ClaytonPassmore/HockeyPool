import json

import MySQLdb

from config import DBConfig


def db_cursor(db):
    def func_wrapper(func):
        def wrapper(*args, **kwargs):
            connection = MySQLdb.connect(
                host=DBConfig.HOST,
                user=DBConfig.USER,
                passwd=DBConfig.PASSWORD,
                db=db
            )
            cursor = connection.cursor()
            ret_val = func(cursor, *args, **kwargs)
            cursor.close()
            connection.close()
            return ret_val
        return wrapper
    return func_wrapper


def db_conn(db):
    def func_wrapper(func):
        def wrapper(*args, **kwargs):
            connection = MySQLdb.connect(
                host=DBConfig.HOST,
                user=DBConfig.USER,
                passwd=DBConfig.PASSWORD,
                db=db
            )
            ret_val = func(connection, *args, **kwargs)
            connection.close()
            return ret_val
        return wrapper
    return func_wrapper


def require_params(*params):
    def func_wrapper(func):
        def wrapper(*args, **kwargs):
            self = args[0]

            # Parse request data as JSON
            request_json = None
            try:
                request_json = json.loads(self.request.data)
            except ValueError as e:
                self.abort(400)

            # Get value of each required param
            param_vals = []
            for param in params:
                if param not in request_json:
                    return self.make_response('Required "{}" but did not find it'.format(param), 400)
                param_vals.append(request_json[param])

            # Call func with required params
            return func(*(param_vals + list(args)), **kwargs)
        return wrapper
    return func_wrapper
