class DomainError(Exception):
    """Errore base del dominio"""
    pass


class PermissionDenied(DomainError):
    pass


class InvalidState(DomainError):
    pass


class DuplicateUsername(DomainError):
    pass


class DuplicateEmail(DomainError):
    pass

class InvalidResetToken(DomainError):
    pass