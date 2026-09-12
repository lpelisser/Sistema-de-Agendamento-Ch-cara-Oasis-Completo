# Correção aplicada neste pacote

## Bug: erro 500 ao criar qualquer reserva

**Arquivo:** `app/crud.py`, função `create_customer`

**Causa:** o argumento `email` era passado duas vezes para `models.Customer()`:
uma vez implicitamente dentro de `**customer_data.model_dump()` (que já inclui
a chave `email`) e outra vez explicitamente logo em seguida. O Python lançava:

```
TypeError: app.models.Customer() got multiple values for keyword argument 'email'
```

Isso derrubava com erro 500 **toda tentativa de criar uma reserva** (endpoint
`POST /api/bookings`), tanto pelo formulário do site quanto por qualquer outro
cliente da API.

**Correção:**

```python
# Antes
customer = models.Customer(
    **customer_data.model_dump(),
    email=str(customer_data.email),
)

# Depois
customer_fields = customer_data.model_dump()
customer_fields["email"] = str(customer_data.email)
customer = models.Customer(**customer_fields)
```

## Testes feitos após a correção

- `POST /api/bookings` com payload real do formulário → `201 Created`
- `GET /api/availability/daily-status` reflete a reserva criada como `OCUPADA`
- `GET /api/availability` retorna `available: false` no período reservado
- Nova tentativa de reserva no mesmo período → `409 Conflict`
- Preflight CORS (`OPTIONS`) entre o front (porta diferente) e o back → `200 OK`
- `npm run build` do front → sem erros
- Front rodando com `VITE_API_URL` apontando para este backend → `200 OK`
