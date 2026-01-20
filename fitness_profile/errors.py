class DomainError(Exception):
    pass

class InvalidState(DomainError):
    pass

class PermissionDenied(DomainError):
    pass