from datetime import datetime

from config import DBConfig


def jsonify_query_results(connector, query):
    cursor = connector.cursor()
    cursor.execute(query)
    columns = [c[0] for c in cursor.description]
    results = []
    for row in cursor:
        decoded_row = []
        for item in row:
            if isinstance(item, str):
                item = item.decode('utf-8')
            decoded_row.append(item)

        results.append(dict(zip(columns, decoded_row)))

    cursor.close()
    return results


def latest_season_db():
    now = datetime.now()
    year = now.year - 1  # Playoffs happen in the new year
    return DBConfig.DB_FORMAT.format(year)
