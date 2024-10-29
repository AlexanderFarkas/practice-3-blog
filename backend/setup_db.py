from backend.src.modules.database.db import Base, db_engine

if __name__ == "__main__":
    import src.app  # noqa: F401

    Base.metadata.create_all(db_engine)
