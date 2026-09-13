import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, Check, LogOut, RefreshCw, X } from "lucide-react";

import {
  adminListBookings,
  adminUpdateBookingStatus,
  type Booking,
  type BookingStatus,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Painel administrativo — Chácara Oasis" }],
  }),
  component: AdminPage,
});

const STORAGE_KEY = "chacara-oasis-admin-key";

const EVENT_LABELS: Record<Booking["event_type"], string> = {
  LAZER_FAMILIA: "Lazer em família",
  ANIVERSARIO: "Aniversário",
  CASAMENTO: "Casamento",
  CORPORATIVO: "Corporativo",
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  CANCELADO: "Cancelado",
  CONCLUIDO: "Concluído",
};

const STATUS_STYLES: Record<BookingStatus, string> = {
  PENDENTE: "bg-amber-100 text-amber-900 border-amber-300",
  CONFIRMADO: "bg-emerald-100 text-emerald-900 border-emerald-300",
  CANCELADO: "bg-red-100 text-red-900 border-red-300",
  CONCLUIDO: "bg-slate-100 text-slate-900 border-slate-300",
};

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function LoginForm({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Painel administrativo</CardTitle>
          <CardDescription>
            Digite a chave de administrador para ver e gerenciar as reservas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (key.trim()) onLogin(key.trim());
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-key">Chave de administrador</Label>
              <Input
                id="admin-key"
                type="password"
                value={key}
                onChange={(event) => setKey(event.target.value)}
                placeholder="Cole aqui a ADMIN_API_KEY"
                autoFocus
              />
            </div>
            <Button type="submit" disabled={!key.trim()}>
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<BookingStatus | "TODAS">("PENDENTE");

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setAdminKey(saved);
  }, []);

  async function loadBookings(key: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await adminListBookings(key);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar reservas.");
      if (err instanceof Error && err.message.includes("inválida")) {
        sessionStorage.removeItem(STORAGE_KEY);
        setAdminKey(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (adminKey) loadBookings(adminKey);
  }, [adminKey]);

  function handleLogin(key: string) {
    sessionStorage.setItem(STORAGE_KEY, key);
    setAdminKey(key);
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey(null);
    setBookings(null);
  }

  async function handleStatusChange(bookingId: string, status: BookingStatus) {
    if (!adminKey) return;
    setUpdatingId(bookingId);
    setError(null);
    try {
      const updated = await adminUpdateBookingStatus(bookingId, status, adminKey);
      setBookings((prev) =>
        prev ? prev.map((b) => (b.id === bookingId ? updated : b)) : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar a reserva.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (!adminKey) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const filtered = (bookings ?? []).filter((b) =>
    filter === "TODAS" ? true : b.status === filter,
  );

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">Reservas — Chácara Oasis</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadBookings(adminKey)}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(["PENDENTE", "CONFIRMADO", "CANCELADO", "CONCLUIDO", "TODAS"] as const).map(
            (status) => (
              <Button
                key={status}
                size="sm"
                variant={filter === status ? "default" : "outline"}
                onClick={() => setFilter(status)}
              >
                {status === "TODAS" ? "Todas" : STATUS_LABELS[status]}
              </Button>
            ),
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
            {error}
          </div>
        )}

        {loading && !bookings ? (
          <p className="text-sm text-muted-foreground">Carregando reservas...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma reserva {filter !== "TODAS" ? `com status "${STATUS_LABELS[filter]}"` : ""}.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{booking.customer.name}</span>
                      <Badge
                        variant="outline"
                        className={STATUS_STYLES[booking.status]}
                      >
                        {STATUS_LABELS[booking.status]}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(booking.check_in)} até {formatDate(booking.check_out)} ·{" "}
                      {booking.guests_count} pessoas · {EVENT_LABELS[booking.event_type]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {booking.customer.email} · {booking.customer.phone} · CPF{" "}
                      {booking.customer.cpf}
                    </span>
                    {booking.notes && (
                      <span className="text-sm italic text-muted-foreground">
                        "{booking.notes}"
                      </span>
                    )}
                  </div>

                  {booking.status === "PENDENTE" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={updatingId === booking.id}
                        onClick={() => handleStatusChange(booking.id, "CONFIRMADO")}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Confirmar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={updatingId === booking.id}
                        onClick={() => handleStatusChange(booking.id, "CANCELADO")}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Recusar
                      </Button>
                    </div>
                  )}

                  {booking.status === "CONFIRMADO" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updatingId === booking.id}
                        onClick={() => handleStatusChange(booking.id, "CONCLUIDO")}
                      >
                        Marcar como concluída
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={updatingId === booking.id}
                        onClick={() => handleStatusChange(booking.id, "CANCELADO")}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}