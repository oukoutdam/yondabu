from pydantic import BaseModel, Field, conlist
from typing import List, Optional

class CreateStructureReq(BaseModel):
    title: str = Field(..., example="いつ どこで だれが なにをした")
    tokens: List[str] = Field(
        ...,
        example=["いつ", "どこで", "だれが", "なにをした"]
    )
    # 先生が同時に見本も入れられる
    exampleSentence: Optional[List[str]] = Field(
        None,
        example=["昨日", "地球で", "猫が", "酒を飲んだ"]
    )

class PostSubmissionReq(BaseModel):
    # tokens と同じ長さの配列を送る（1投稿＝1行）
    values: conlist(str, min_length=1) = Field(
        ...,
        example=["昨日", "地球で", "猫が", "酒を飲んだ"]
    )
    userId: Optional[str] = Field(None, example="student1")
