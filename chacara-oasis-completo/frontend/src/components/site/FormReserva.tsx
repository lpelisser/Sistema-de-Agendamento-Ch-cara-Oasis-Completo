import { useState } from "react";
import { MessageCircle, Mail } from "lucide-react";
import { Calendario } from "./Calendario";
import { TIPOS_EVENTO, WHATSAPP, formatarBR } from "./data";
import { checkAvailability, createBooking, type BookingPayload } from "@/lib/api";

type Props = { inicio: string; fim: string; pessoas: string; setDatas: (inicio: string, fim: string) => void; setPessoas: (v: string) => void };
const campo = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30";
const EVENT_TYPES = {
  "Lazer em família": "LAZER_FAMILIA",
  "Aniversário": "ANIVERSARIO",
  "Casamento": "CASAMENTO",
  "Corporativo": "CORPORATIVO",
} as const;
const EVENT_LABELS: Record<string, string> = { LAZER_FAMILIA: "Lazer em família", ANIVERSARIO: "Aniversário", CASAMENTO: "Casamento", CORPORATIVO: "Corporativo", "Fim de semana comum": "Fim de semana comum" };

export function FormReserva({ inicio, fim, pessoas, setDatas, setPessoas }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipo, setTipo] = useState<BookingPayload["event_type"]>("LAZER_FAMILIA");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [enviando, setEnviando] = useState(false);

  const montarTexto = () => ["*Solicitação de pré-reserva — Chácara Oasis*", `Nome: ${nome}`, `E-mail: ${email}`, `Telefone/WhatsApp: ${telefone}`, `CPF: ${cpf}`, `Entrada: ${formatarBR(inicio)}`, `Saída: ${formatarBR(fim)}`, `Tipo de evento: ${EVENT_LABELS[tipo]}`, `Pessoas: ${pessoas}`, mensagem ? `Observações: ${mensagem}` : ""].filter(Boolean).join("\n");

  const validar = () => {
    if (!nome.trim() || !email.trim() || !telefone.trim() || !cpf.trim() || !inicio || !fim || !pessoas) return "Preencha todos os campos obrigatórios e selecione entrada e saída.";
    if (cpf.replace(/\D/g, "").length !== 11) return "Informe um CPF válido com 11 dígitos.";
    if (Number(pessoas) < 1 || Number(pessoas) > 20) return "A quantidade de pessoas deve estar entre 1 e 20.";
    if (fim <= inicio) return "A data de saída deve ser posterior à data de entrada.";
    return "";
  };

  const enviar = async (destino: "whatsapp" | "email") => {
    const validacao = validar();
    if (validacao) { setErro(validacao); setSucesso(""); return; }
    setErro(""); setSucesso(""); setEnviando(true);
    try {
      const disponibilidade = await checkAvailability(inicio, fim);
      if (!disponibilidade.available) throw new Error("Esse período acabou de ficar indisponível. Escolha outras datas.");
      const booking = await createBooking({ customer: { name: nome.trim(), email: email.trim(), phone: telefone.trim(), cpf: cpf.replace(/\D/g, "") }, check_in: inicio, check_out: fim, guests_count: Number(pessoas), event_type: tipo, notes: mensagem.trim() || undefined });
      setSucesso(`Solicitação enviada com sucesso! Código: ${booking.id}. O ADM recebeu o resumo por e-mail.`);
      if (destino === "whatsapp") window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(montarTexto() + `\nCódigo da solicitação: ${booking.id}`)}`, "_blank");
      setNome(""); setEmail(""); setTelefone(""); setCpf(""); setMensagem("");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível enviar a solicitação.");
    } finally { setEnviando(false); }
  };

  return <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
    <div><Calendario inicio={inicio} fim={fim} onChange={setDatas} /><p className="mt-4 rounded-2xl bg-secondary/60 p-4 text-sm text-secondary-foreground">As datas ocupadas ou bloqueadas são consultadas diretamente no sistema. Selecione entrada e saída para solicitar a pré-reserva.</p></div>
    <form className="rounded-3xl border border-border bg-card p-5 sm:p-7 card-soft" onSubmit={(e) => { e.preventDefault(); void enviar("whatsapp"); }}>
      <h3 className="text-xl">Formulário de pré-reserva</h3>
      <div className="mt-5 grid gap-4">
        <input className={campo} placeholder="Nome completo *" value={nome} onChange={(e) => setNome(e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2"><input className={campo} type="email" placeholder="E-mail *" value={email} onChange={(e) => setEmail(e.target.value)} /><input className={campo} placeholder="Telefone / WhatsApp *" value={telefone} onChange={(e) => setTelefone(e.target.value)} /></div>
        <input className={campo} inputMode="numeric" placeholder="CPF *" value={cpf} onChange={(e) => setCpf(e.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-muted-foreground">Data de início<input className={`${campo} mt-1`} type="date" value={inicio} onChange={(e) => setDatas(e.target.value, fim)} /></label><label className="text-sm text-muted-foreground">Data de término<input className={`${campo} mt-1`} type="date" value={fim} onChange={(e) => setDatas(inicio, e.target.value)} /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><select className={campo} value={tipo} onChange={(e) => setTipo(e.target.value as BookingPayload["event_type"])}>{TIPOS_EVENTO.slice(0, 4).map((t) => <option key={t} value={EVENT_TYPES[t as keyof typeof EVENT_TYPES]}>{t}</option>)}</select><input className={campo} type="number" min={1} max={20} placeholder="Quantidade de pessoas *" value={pessoas} onChange={(e) => setPessoas(e.target.value)} /></div>
        <textarea className={`${campo} min-h-28 resize-y`} placeholder="Mensagem ou observações" value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
      </div>
      {erro && <p className="mt-4 text-sm text-destructive">{erro}</p>}
      {sucesso && <p className="mt-4 text-sm text-folha">{sucesso}</p>}
      <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="submit" disabled={enviando} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-60"><MessageCircle className="h-4 w-4" /> {enviando ? "Enviando…" : "Enviar no WhatsApp"}</button><button type="button" disabled={enviando} onClick={() => void enviar("email")} className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary disabled:opacity-60"><Mail className="h-4 w-4" /> Solicitar por e-mail</button></div>
    </form>
  </div>;
}
