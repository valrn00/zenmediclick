from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+mysqlconnector://root:tu_password@localhost/zenmediclick"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
a= python