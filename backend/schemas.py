from pydantic import BaseModel

class SetNumberRequest(BaseModel):
    number: int