const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export type DailyStatus = {
  date: string;
  status: "LIVRE" | "OCUPADA" | "BLOQUEADA";
  booking_id?: string | null;
  reason?: string | null;
};

export type BookingPayload = {
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  check_in: string;
  check_out: string;
  guests_count: number;
  event_type: "LAZER_FAMILIA" | "ANIVERSARIO" | "CASAMENTO" | "CORPORATIVO";
  notes?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Não foi possível concluir a solicitação.";
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") message = body.detail;
      else if (Array.isArray(body?.detail)) message = body.detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join(" ");
    } catch {
      // Mantém a mensagem padrão quando a API não retorna JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function getDailyStatus(startDate: string, endDate: string) {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
  return request<DailyStatus[]>(`/api/availability/daily-status?${params.toString()}`);
}

export function createBooking(payload: BookingPayload) {
  return request<{ id: string }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function checkAvailability(startDate: string, endDate: string) {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
  return request<{ available: boolean }>(`/api/availability?${params.toString()}`);
}

export { API_URL };
