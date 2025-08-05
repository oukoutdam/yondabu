from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from number_store import NumberStore
from schemas import SetNumberRequest

STORED_NUMBER = None

app = FastAPI()
number_store = NumberStore()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/number")
def get_number():
    number = number_store.get_number()
    return {"number" : number}

@app.post("/number")
def set_number(request: SetNumberRequest):
    number_store.set_number(request.number)
    return {"message": "Number set successfully", "number": number_store.get_number()}

