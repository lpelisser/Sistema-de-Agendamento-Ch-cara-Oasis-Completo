import os

from fastapi import Header, HTTPException


def verify_admin_key(x_admin_key: str = Header(default="")) -> None:
    """Protege endpoints administrativos com uma chave simples.

    A chave correta fica na variável de ambiente ADMIN_API_KEY. Se ela não
    estiver configurada, os endpoints protegidos ficam bloqueados por
    segurança (fail-closed), em vez de abertos por engano.
    """
    expected_key = os.getenv("ADMIN_API_KEY", "")

    if not expected_key:
        raise HTTPException(
            status_code=503,
            detail=(
                "Painel administrativo não configurado. "
                "Defina ADMIN_API_KEY nas variáveis de ambiente do backend."
            ),
        )

    if x_admin_key != expected_key:
        raise HTTPException(status_code=401, detail="Chave de administrador inválida.")