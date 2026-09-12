export const WHATSAPP = "5511966570203";
export const TELEFONE = "(11) 96657-0203";
export const EMAIL = "contato@chacaraoasis.com.br";
export const ENDERECO =
  "Condomínio Real Village - Estrada de Aparecedinha, 811 - Cruz das Almas, Araçariguama - SP, 18147-000";

export const NAV = [
  { label: "Início", href: "#inicio" },
  { label: "A Chácara", href: "#sobre" },
  { label: "Estrutura", href: "#estrutura" },
  { label: "Ambientes", href: "#ambientes" },
  { label: "Reservas", href: "#reservas" },
  { label: "Contato", href: "#contato" },
];

export const TIPOS_EVENTO = [
  "Lazer em família",
  "Aniversário",
  "Casamento",
  "Corporativo",
  "Fim de semana comum",
];

export const formatarBR = (iso: string) => {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
};
