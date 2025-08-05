from fastapi import HTTPException

class NumberStore:
    def __init__(self):
        self.current_number = None
    
    def get_number(self):
        return self.current_number
    
    def set_number(self, new_number: int):
        self.current_number = new_number
