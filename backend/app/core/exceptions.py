class ApiError(Exception):
    def __init__(self, message, status=400, errors=None):
        self.message = message
        self.status = status
        self.errors = errors or None
        super().__init__(message)
