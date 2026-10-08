// Conteúdo único (slides + vídeo) da apresentação FrotaCOSEG.
// Os trechos de código são lidos direto do repositório, com os números de linha reais.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(aqui, "..", "repo", "reservas");
const cache = {};
function arquivo(nome) {
  return (cache[nome] ??= fs.readFileSync(path.join(REPO, nome), "utf8").replace(/\r/g, "").split("\n"));
}

/** Trecho [a..b] de um arquivo; `passo` liga o trecho ao item que o destaca. */
export function R(f, a, b, passo = null) {
  const L = arquivo(f);
  const out = [];
  for (let n = a; n <= b; n++) out.push({ f, n, t: L[n - 1], passo });
  return out;
}
/** Acha o número da primeira linha que casa com a expressão. */
export function achar(f, re) {
  const i = arquivo(f).findIndex((l) => re.test(l));
  if (i < 0) throw new Error(`linha não encontrada em ${f}: ${re}`);
  return i + 1;
}
export const SEP = [{ sep: true }];

const cen = JSON.parse(fs.readFileSync(path.join(aqui, "cenarios.json"), "utf8"));
function msg(o) {
  const r = o.resposta;
  if (r.sucesso) return r.mensagem + (r.reserva ? ` Veículo: ${r.reserva.veiculo.codigo}.` : "");
  const e = Object.values(r.erros || {})[0];
  return e ? e[0].message : r.mensagem;
}
const get = (prefixo) => cen.find((c) => c.cenario.startsWith(prefixo));

const urlsIni = achar("urls.py", /urlpatterns/);
const urlLinha = (re) => achar("urls.py", re);

export const slides = [
  {
    id: "capa", tipo: "capa",
    titulo: "FrotaCOSEG",
    sub: "O SISTEMA DE RESERVA DE VEÍCULOS DO PORTO DO ITAQUI",
    tags: [],
    notas: "Apresente-se, diga o nome do grupo e o objetivo: mostrar como o servidor (a 'camada de servidor') do sistema de reservas funciona, sem precisar entender de programação.",
    legenda: "Esta é a apresentação do FrotaCOSEG: o servidor que controla as reservas de veículos do Porto do Itaqui.",
  },
  {
    id: "contexto", tipo: "visual", visual: "frota",
    titulo: "O Porto do Itaqui divide uma frota de 10 veículos entre várias equipes",
    itens: [
      { t: "A frota tem 8 veículos leves, de até 4 passageiros.", l: "A frota do Porto do Itaqui tem oito veículos leves, com capacidade de até quatro passageiros." },
      { t: "Há também 2 veículos coletivos, de até 18 passageiros.", l: "Há ainda dois veículos coletivos, que levam até dezoito passageiros." },
      { t: "Os pedidos chegavam por telefone, mensagem, e-mail, balcão e planilhas.", l: "Os pedidos chegavam por vários canais, sem um padrão e sem um registro central." },
    ],
    notas: "Contexto: o Porto do Itaqui tem uma frota compartilhada (8 leves e 2 coletivos) usada por várias equipes. Os pedidos chegavam por canais diferentes, o que leva ao problema do próximo slide.",
  },
  {
    id: "problema", tipo: "visual", visual: "frota",
    titulo: "Reservas por telefone e planilha geravam carros duplicados, lotados e horários sobrepostos",
    itens: [
      { t: "Duas equipes esperaram o mesmo veículo para atividades diferentes.", l: "Sem um registro central, duas equipes esperaram o mesmo carro e o motorista recebeu ordens contraditórias." },
      { t: "Um carro de 4 lugares foi pedido para 7 pessoas e ninguém percebeu.", l: "Um pedido de sete pessoas para um carro de quatro lugares só foi percebido na hora da saída." },
      { t: "O horário de retorno era ignorado: o carro das 14h foi prometido de novo às 14h.", l: "Ninguém controlava o horário de retorno. Se o primeiro passeio atrasava, o segundo ficava sem carro." },
    ],
    notas: "Resuma os três casos do enunciado. A ideia central: não basta registrar a saída, é preciso controlar todo o intervalo de uso do veículo.",
  },
  {
    id: "solucao", tipo: "visual", visual: "arq",
    titulo: "Um servidor central guarda todas as reservas e recusa o que for inválido",
    itens: [
      { t: "A interface web envia o pedido de reserva ao servidor.", l: "Pense no servidor como um porteiro: toda solicitação passa por ele antes de entrar." },
      { t: "O servidor confere as regras: capacidade, data, horário e conflito.", l: "Ele confere as regras do negócio: quantas pessoas cabem, se a data vale e se o carro está livre." },
      { t: "Só o que passa nas regras é gravado no banco de dados.", l: "Só o que passa em todas as conferências é gravado no banco de dados. O resto volta com uma mensagem clara." },
    ],
    notas: "Analogia do porteiro. O servidor é a 'fonte de verdade': a interface apenas pede, quem decide é o servidor.",
  },
  {
    id: "mapa", tipo: "visual", visual: "arquivos",
    titulo: "O projeto se divide em arquivos, e cada um tem uma função simples",
    itens: [
      { t: "models.py define o que o sistema guarda.", l: "O arquivo models.py descreve o que o sistema guarda: veículos e reservas." },
      { t: "services.py reúne as regras de negócio.", l: "O services.py reúne as regras do negócio em funções pequenas, fáceis de entender." },
      { t: "views.py e urls.py recebem os pedidos e respondem.", l: "Views e URLs recebem os pedidos da interface e devolvem as respostas. Os testes provam que tudo funciona." },
    ],
    notas: "Não leia o código. Aponte cada arquivo e diga a função em uma frase. Os números de linha dos próximos slides são do arquivo real.",
  },
  {
    id: "models", tipo: "codigo", arq: "models.py",
    titulo: "O banco guarda duas coisas: a frota de veículos e as reservas feitas",
    itens: [
      { t: "Veículo: código, categoria e capacidade (que vem da categoria).", l: "Um veículo tem código, categoria e capacidade. A capacidade vem automaticamente da categoria." },
      { t: "Reserva: quem pediu, para onde, quando e quantas pessoas.", l: "Uma reserva guarda quem pediu, origem, destino, data, horários e número de passageiros." },
      { t: "Cada reserva aponta para um veículo.", l: "Cada reserva aponta para um veículo. Assim o banco sabe exatamente qual carro está ocupado." },
    ],
    codigo: [
      ...R("models.py", 29, 29), ...R("models.py", 34, 37, 0), ...SEP,
      ...R("models.py", 72, 72), ...R("models.py", 77, 78, 1), ...R("models.py", 82, 83, 1), ...R("models.py", 86, 87, 1), ...R("models.py", 88, 88, 2),
    ],
    notas: "Compare com uma planilha: Veículo é uma aba, Reserva é outra. A 'ForeignKey' é o vínculo entre as duas.",
  },
  {
    id: "capacidade", tipo: "codigo", arq: "models.py",
    titulo: "Antes de salvar, o servidor confere se todos os passageiros cabem no veículo",
    itens: [
      { t: "Leve leva até 4 pessoas. Coletivo, até 18.", l: "A regra é simples: veículo leve comporta 4 pessoas e o coletivo comporta 18." },
      { t: "Mais de 18 pessoas: o pedido é rejeitado.", l: "Se alguém pedir mais de 18 passageiros, o servidor rejeita a solicitação." },
      { t: "7 pessoas num carro de 4? Erro claro, antes da saída.", l: "Pediu 7 pessoas para um carro de 4 lugares? O erro aparece antes da saída, com a mensagem explicando." },
    ],
    codigo: [
      ...R("services.py", 8, 8, 0), ...SEP,
      ...R("models.py", 200, 201), ...R("models.py", 202, 204, 1), ...R("models.py", 205, 205), ...R("models.py", 206, 209, 2),
    ],
    notas: "Mostre a primeira linha: o dicionário CAPACIDADES é a regra. Depois mostre que o código compara passageiros com a capacidade.",
  },
  {
    id: "periodo", tipo: "codigo", arq: "services.py",
    titulo: "O servidor não aceita data no passado nem retorno antes da saída",
    itens: [
      { t: "Data anterior a hoje: recusada.", l: "A data de saída não pode estar no passado. Se estiver, o servidor devolve um erro." },
      { t: "O retorno precisa ser depois da saída.", l: "O horário de retorno precisa ser depois da saída. Senão a reserva é recusada." },
      { t: "Viagem após a meia-noite vale, com data de retorno (máx. 1 dia).", l: "Viagens que passam da meia-noite são aceitas, desde que informem a data de retorno, com no máximo um dia." },
    ],
    codigo: [
      ...R("services.py", 32, 35, 0), ...SEP,
      ...R("services.py", 54, 57, 1), ...SEP,
      ...R("services.py", 10, 10, 2),
    ],
    notas: "A função validar_periodo devolve uma lista de erros. Lista vazia significa período válido.",
  },
  {
    id: "conflito", tipo: "visual", visual: "conflito", arq: "services.py",
    titulo: "Há conflito quando o mesmo veículo é pedido em períodos que se sobrepõem",
    itens: [
      { t: "Reserva existente: VL-01, das 8h às 10h.", l: "Imagine o carro VL-01 reservado das 8h às 10h." },
      { t: "Pedido das 9h às 11h se sobrepõe: é recusado.", l: "Um novo pedido das 9h às 11h começa antes de o primeiro terminar. Isso é conflito e o servidor recusa." },
      { t: "Pedido das 10h30 às 12h não se sobrepõe: é aceito.", l: "Já o pedido das 10h30 às 12h começa depois do fim. Não há sobreposição, então é aceito." },
    ],
    codigo: [
      ...R("services.py", 79, 79), ...R("services.py", 81, 82, 0), ...R("services.py", 83, 83, [1, 2]),
    ],
    notas: "É o exemplo do enunciado. A comparação 'começa antes do fim do outro E termina depois do começo do outro' detecta qualquer sobreposição.",
  },
  {
    id: "disponibilidade", tipo: "codigo", arq: "services.py",
    titulo: "Se o usuário informa só a categoria, o servidor escolhe o menor veículo livre",
    itens: [
      { t: "Primeiro, descarta os veículos já ocupados no período.", l: "Primeiro o servidor descarta os veículos que já estão reservados naquele período." },
      { t: "Depois, mantém só os ativos com lugares suficientes.", l: "Depois mantém só os veículos ativos com lugares suficientes para o grupo." },
      { t: "Ordena do menor para o maior e sugere o primeiro.", l: "Por fim ordena do menor para o maior e sugere o primeiro, evitando usar um coletivo para duas pessoas." },
    ],
    codigo: [
      ...R("services.py", 96, 100, 0), ...R("services.py", 101, 101, 1), ...R("services.py", 102, 103), ...R("services.py", 104, 104, 2),
    ],
    notas: "Esta função é usada tanto na atribuição automática quanto na rota de disponibilidade.",
  },
  {
    id: "rotas", tipo: "codigo", arq: "urls.py",
    titulo: "O servidor oferece endereços (rotas) para cadastrar, consultar e cancelar reservas",
    itens: [
      { t: "Cadastrar e consultar veículos e reservas (CRUD).", l: "Cada linha do arquivo urls.py é um endereço que a interface pode chamar para cadastrar e consultar." },
      { t: "Cancelar libera o veículo sem apagar o histórico.", l: "Cancelar uma reserva libera o veículo sem apagar o histórico." },
      { t: "Disponibilidade mostra quais veículos estão livres.", l: "A rota de disponibilidade mostra, para um horário, quais veículos estão livres." },
    ],
    codigo: [
      ...R("urls.py", urlsIni, urlsIni), ...R("urls.py", urlLinha(/"csrf\/"/), urlLinha(/"eu\/"/)),
      ...R("urls.py", urlLinha(/"veiculos\/"/), urlLinha(/"reservas\/<int:pk>\/"/), 0),
      ...R("urls.py", urlLinha(/cancelar/), urlLinha(/cancelar/), 1),
      ...R("urls.py", urlLinha(/disponibilidade/), urlLinha(/disponibilidade/), 2),
    ],
    notas: "CRUD = Criar, Ler, Atualizar e Excluir (Create, Read, Update, Delete). O enunciado pede essas operações.",
  },
  {
    id: "seguranca", tipo: "codigo", arq: "views.py",
    titulo: "Só quem fez login usa o sistema, e a frota só pode ser alterada pelo COSEG",
    itens: [
      { t: "Login obrigatório. 5 erros bloqueiam por 5 minutos.", l: "O login é obrigatório. Depois de cinco senhas erradas, o acesso fica bloqueado por cinco minutos." },
      { t: "Só o COSEG cria ou altera veículos.", l: "Só o COSEG, a equipe administradora, pode criar ou alterar veículos." },
      { t: "Cada pessoa vê só as próprias reservas.", l: "Cada colaborador vê apenas as próprias reservas, e as gravações exigem um token de proteção, o CSRF." },
    ],
    codigo: [
      ...R("views.py", 179, 180, 0), ...R("views.py", 182, 185, 0), ...SEP,
      ...R("views.py", 145, 147, 1), ...SEP,
      ...R("views.py", 151, 152, 2),
    ],
    notas: "Segurança é um extra além do enunciado, mas importa: sem ela qualquer pessoa poderia mexer na frota.",
  },
  {
    id: "evidencias", tipo: "visual", visual: "cenarios",
    titulo: "Cenários reais comprovam que o servidor aceita o válido e recusa o inválido",
    itens: [
      { t: "Reservas válidas retornam 201 (criado).", l: "Reservas válidas retornam o código 201, que significa criado com sucesso." },
      { t: "Regras violadas retornam 400, com mensagem clara.", l: "Regras violadas retornam 400, com a mensagem explicando o que corrigir." },
      { t: "Conflito de horário retorna 409.", l: "Conflito de horário retorna 409. E os 42 testes automáticos do projeto passam." },
    ],
    cenarios: [
      { n: "Pedido 10h30–12h (sem conflito)", c: 201, m: msg(get("Sem conflito")), p: 0 },
      { n: "Atribuição automática por categoria", c: 201, m: msg(get("Atribuição")), p: 0 },
      { n: "7 pessoas em carro de 4 lugares", c: 400, m: msg(get("Capacidade")), p: 1 },
      { n: "19 pessoas (acima do limite)", c: 400, m: msg(get("Acima")), p: 1 },
      { n: "Retorno antes da saída", c: 400, m: "O horário de retorno deve ser posterior ao de saída.", p: 1 },
      { n: "Campos obrigatórios em branco", c: 400, m: "Este campo é obrigatório.", p: 1 },
      { n: "Pedido 9h–11h (VL-01 já reservado)", c: 409, m: "Conflito: VL-01 já está reservado nesse intervalo.", p: 2 },
    ],
    notas: "Estas respostas foram geradas rodando o sistema de verdade (modo demonstração, que aceita as datas de agosto de 2026 do enunciado). Os 42 testes automáticos do projeto também passaram.",
  },
  {
    id: "obrigado", tipo: "fim",
    titulo: "Obrigado!",
    equipe: ["Davi Maia", "Gabriel Dantas", "Juliana Silva", "Luiz Saiki", "Mie Shimpo"],
    notas: "Agradeça e apresente os integrantes da equipe. Abra para perguntas.",
    legenda: "Obrigado! Equipe: Davi Maia, Gabriel Dantas, Juliana Silva, Luiz Saiki e Mie Shimpo.",
  },
];
