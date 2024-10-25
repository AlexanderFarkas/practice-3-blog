from dotenv import dotenv_values

config = dotenv_values(".env")
JWT_SECRET = config["JWT_SECRET"]
JWT_ALGORITHM = config["JWT_ALGORITHM"]
DB_CONNECTION_STRING = config["DB_CONNECTION_STRING"]