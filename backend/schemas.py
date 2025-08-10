# backend/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional

class CreateStructureReq(BaseModel):
    title: str = Field(..., example="いつ どこで だれが なにをした")
    tokens: List[str] = Field(..., example=["いつ", "どこで", "だれが", "なにをした"])
    exampleSentence: Optional[List[str]] = Field(None, example=["昨日","地球で","猫が","酒を飲んだ"])

class PostSubmissionReq(BaseModel):
    userId: Optional[str] = Field(None, example="student1")
    values: list[str] = Field(..., min_length=1, example=["昨日","部屋で","私が","倒立した"])

class SignUpReq(BaseModel):
    username: str = Field(..., min_length=3, max_length=32)
    password: str = Field(..., min_length=6, max_length=128)
