class DomainError(Exception):
    pass

class PermissionDenied(DomainError):
    pass


class InvalidState(DomainError):
    pass