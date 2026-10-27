// Conteúdo da apresentação do front-end do FrotaCOSEG (PBL 2).
// Cada tela é explicada com o print real (assets/prints-frontend/, vindos de COSEG_beta/docs/evidencias/kaseki).
// Marcas: [x, y, largura, altura] em pixels do print original; uma por item, na ordem dos itens.

export const deck = {
  rotulo: "FrotaCOSEG · Programação para Web · PBL 2",
  tituloPagina: "FrotaCOSEG — Front-end",
  saida: "slides-frontend",
};

export const slides = [
  {
    id: "capa", tipo: "capa",
    titulo: "FrotaCOSEG",
    sub: "AS TELAS DO SISTEMA: O QUE A EQUIPE DO PORTO VÊ E USA PARA RESERVAR VEÍCULOS",
    tags: [],
    notas: "Retome a primeira apresentação em uma frase (o servidor que confere as regras) e diga que agora vamos mostrar as telas, a parte que o usuário usa no dia a dia.",
  },
  {
    id: "ponte", tipo: "visual", visual: "arq2",
    titulo: "Antes mostramos o servidor; agora, as telas que conversam com ele",
    itens: [
      { t: "Na primeira parte: o servidor, que confere as regras e grava as reservas." },
      { t: "Agora: as telas, onde a pessoa pede, consulta e acompanha os veículos." },
      { t: "A tela avisa, mas quem decide continua sendo o servidor." },
    ],
    notas: "Use de novo a analogia do porteiro: as telas são o balcão de atendimento, o servidor continua sendo o porteiro que decide quem entra.",
  },
  {
    id: "entrar", tipo: "visual", visual: "print", print: "entrar-erro-401-1440", url: "/entrar/",
    titulo: "Cada pessoa entra com seu usuário, e a tela explica quando algo dá errado",
    itens: [
      { t: "Usuário e senha: cada pessoa vê o que é dela.", m: [538, 456, 364, 154] },
      { t: "Senha errada? A mensagem diz o que houve, sem apagar o usuário.", m: [538, 371, 364, 66] },
      { t: "Depois de 6 tentativas erradas, o login espera 5 minutos.", m: [538, 627, 364, 46] },
    ],
    notas: "O bloqueio de 5 minutos protege contra quem tenta adivinhar senhas. Foi testado no QA (6ª tentativa recusada).",
  },
  {
    id: "painel", tipo: "visual", visual: "print", print: "painel-coseg-1440", url: "/painel/",
    titulo: "O painel do dia mostra a frota inteira em uma tela",
    itens: [
      { t: "Os números do dia: em uso, livres e reservas de hoje.", m: [272, 95, 1154, 125] },
      { t: "A linha do tempo mostra cada veículo hora a hora; a linha verde é agora.", m: [272, 234, 800, 577] },
      { t: "“Na rua agora”: quem está com cada veículo e quando volta.", m: [1086, 234, 340, 292] },
    ],
    notas: "Esta é a primeira tela depois do login. Mostre o VL-04 hachurado: ele está inativo, fora de operação.",
  },
  {
    id: "frota", tipo: "visual", visual: "print", print: "frota-coseg-1440", url: "/frota/",
    titulo: "Na frota, cada veículo mostra se está livre, em uso ou parado",
    itens: [
      { t: "Filtros separam livres, em uso e inativos.", m: [620, 33, 365, 34] },
      { t: "2 coletivos e 8 leves, cada um com sua situação.", m: [272, 100, 750, 470] },
      { t: "Ao clicar, aparece a agenda do veículo e as ações do COSEG.", m: [1036, 95, 390, 513] },
    ],
    notas: "Editar, desativar e excluir veículo só aparecem para a equipe do COSEG. O colaborador vê a mesma tela, só para consulta (slide de perfis).",
  },
  {
    id: "reservas", tipo: "visual", visual: "print", print: "reservas-coseg-1440", url: "/reservas/",
    titulo: "A lista de reservas organiza a semana e mostra a situação de cada pedido",
    itens: [
      { t: "A semana aparece dia a dia, com quantas reservas há em cada um.", m: [272, 95, 1154, 60] },
      { t: "Filtros por situação: hoje, próximas, concluídas e canceladas.", m: [290, 189, 515, 34] },
      { t: "Cada linha: veículo, quem pediu, trajeto, horário e situação.", m: [290, 276, 1118, 590] },
    ],
    notas: "Aponte a reserva cancelada (riscada) e as que estão em andamento. Dá para ver, editar ou cancelar pelos ícones no fim da linha.",
  },
  {
    id: "nova", tipo: "visual", visual: "print", print: "reserva-nova-coseg-1440", url: "/reservas/nova/",
    titulo: "Pedir um veículo leva quatro passos, num formulário só",
    itens: [
      { t: "Quem pede, trajeto, horário e veículo, em blocos numerados.", m: [290, 115, 215, 600] },
      { t: "Dá para escolher o veículo ou só a categoria: o sistema pega o menor livre.", m: [750, 613, 220, 46] },
      { t: "Ao lado, a lista dos veículos livres no horário escolhido.", m: [1006, 95, 420, 162] },
    ],
    notas: "O nome do solicitante já vem preenchido com quem está logado. A lista ao lado se atualiza conforme a pessoa preenche data, horário e passageiros.",
  },
  {
    id: "alerta", tipo: "visual", visual: "print", print: "form-alerta-7-passageiros-1440", url: "/reservas/nova/",
    titulo: "Se o pedido não cabe no veículo, a tela avisa antes de enviar",
    itens: [
      { t: "7 pessoas num veículo leve? O aviso aparece na hora.", m: [468, 647, 264, 104] },
      { t: "A lista ao lado já mostra que nenhum veículo leve atende.", m: [1046, 95, 380, 342] },
      { t: "É só um aviso: quem confirma é o servidor, ao enviar.", m: null },
    ],
    notas: "É o mesmo caso do enunciado (7 pessoas para um carro de 4). Na primeira apresentação o servidor recusava; agora a pessoa já vê o problema antes de enviar.",
  },
  {
    id: "conflito", tipo: "visual", visual: "print", print: "form-conflito-409-1440", url: "/reservas/nova/", topo: 90,
    titulo: "Quando o veículo já está reservado, a tela mostra o motivo e as opções livres",
    itens: [
      { t: "O servidor recusou: o VL-01 já está reservado nesse horário.", m: [290, 113, 724, 90] },
      { t: "O campo do veículo fica marcado, com a mesma explicação.", m: [468, 800, 542, 110] },
      { t: "Ao lado, os veículos livres no horário: é só escolher outro.", m: [1046, 206, 380, 860] },
    ],
    notas: "É a regra de conflito da primeira apresentação, agora vista pelo usuário. Nada é perdido: o formulário continua preenchido.",
  },
  {
    id: "perfis", tipo: "visual", visual: "print", print: "frota-colaborador-1440", url: "/frota/",
    titulo: "O colaborador vê a mesma frota, mas só para consulta",
    itens: [
      { t: "O menu não tem a parte de Gestão de veículos.", m: [28, 130, 216, 130] },
      { t: "No detalhe, ele vê só as próprias reservas.", m: [1054, 310, 360, 150] },
      { t: "Aviso claro: a gestão da frota é do COSEG.", m: [1054, 490, 330, 32] },
    ],
    notas: "Compare com o slide da frota: lá, logada como COSEG, a Carla tinha Editar, Desativar e Excluir. Aqui a Ana, colaboradora, só consulta.",
  },
  {
    id: "celular", tipo: "visual", visual: "celulares",
    celulares: ["painel-coseg-360", "reservas-coseg-360", "reserva-nova-coseg-360"],
    titulo: "Tudo funciona também no celular",
    itens: [
      { t: "O menu lateral vira um botão no topo." },
      { t: "Cartões e reservas ficam empilhados, fáceis de rolar." },
      { t: "O formulário de reserva funciona igual." },
    ],
    notas: "As telas foram conferidas em três larguras: computador (1440 px), tablet (768 px) e celular (360 px).",
  },
  {
    id: "qa", tipo: "visual", visual: "placar",
    titulo: "Testamos cada tela no navegador antes de entregar",
    itens: [
      { t: "41 casos de teste executados, todos aprovados." },
    ],
    notas: "O QA passou por login, reservas, mensagens do servidor, frota, painel e responsividade.",
  },
  {
    id: "obrigado", tipo: "fim",
    titulo: "Obrigado!",
    equipe: ["Davi Maia", "Gabriel Dantas", "Juliana Silva", "Luiz Saiki", "Mie Shimpo"],
    notas: "Agradeça, apresente a equipe e abra para perguntas. Se der tempo, abra a demonstração ao vivo.",
  },
];
