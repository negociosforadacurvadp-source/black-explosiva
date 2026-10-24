/*
  =====================================================================
  CONFIGURAÇÃO ÚNICA DO FUNIL — vendas, upsell, downsell, comunidade, obrigado
  ---------------------------------------------------------------------
  • Checkout, pagamento e área de membros: TICTO (universidadedosnegocios.ticto.club).
  • Campo vazio ("") = a parte correspondente fica escondida do visitante.
  • "SUGESTÃO" = valor proposto. Confirme ou troque antes de publicar.
  • Os preços COBRADOS são os cadastrados na Ticto. Os daqui são só o que a página MOSTRA:
    mantenha os dois iguais.
  • Sem os links da Ticto, o funil roda em MODO DE TESTE (só navega entre as páginas).
  • Para ver tudo que falta: abra qualquer página com ?revisao=1 no link.
  =====================================================================
*/
window.OFERTA = {

  // =============== TICTO: checkout, upsell de 1 clique e área de membros
  ticto: {
    checkoutUrl: "",               // link do checkout do Método (Ticto > Produto > Links/Ofertas). Order bump do App: configurar no checkout da Ticto
    upsellUrl: "",                 // link de 1 clique do Acompanhamento (oferta de upsell na Ticto)
    downsellUrl: "",               // link de 1 clique do Acompanhamento Essencial
    comunidadeUrl: "",             // link de 1 clique da Comunidade
    areaMembrosUrl: "https://universidadedosnegocios.ticto.club/play"
  },

  // =============== (não usado com a Ticto) pagamento direto pelo Mercado Pago — mantido para o futuro
  pagamento: {
    mpPublicKey: "",               // Mercado Pago > Suas integrações > Credenciais > Public Key (TEST-... para testes)
    apiUrl: "https://chtlbojdlpnldugrzwga.supabase.co/functions/v1",
    maxParcelas: 12,               // deve bater com funil_produtos.max_parcelas
    termosUrl: "termos.html",
    privacidadeUrl: "privacidade.html"
  },

  // =============== PRODUTO PRINCIPAL: Método Black Friday Explosiva
  principal: { item: "metodo", nome: "Método Black Friday Explosiva", preco: "R$67" },
  vendasAte: "2026-11-05T23:59:59-03:00",
  parcelamento: "",                // ex.: "ou 12x de R$ 6,93" (valor real com juros da Ticto)
  tempoAcesso: "O acesso é vitalício: você assiste às aulas quantas vezes quiser, sem prazo para acabar.",
  bio: "Daniel Pereira é fundador do Negócios Fora da Curva, a maior escola de negócios do Tocantins. Há mais de 10 anos atua no desenvolvimento de empresários e equipes comerciais, já impactando mais de 20 mil empresas em todo o Brasil por meio de treinamentos, mentorias e consultorias. É especialista em vendas, liderança, gestão e crescimento empresarial.",  // bio do Daniel (texto do Kaio) (parágrafos separados por linha em branco)
  rodapeEmpresa: "Negócios Fora da Curva · CNPJ 22.830.839/0001-90",
  empresa: { razaoSocial: "Negócios Fora da Curva", cnpj: "22.830.839/0001-90" },
  contatoEmail: "",                // e-mail para dúvidas, cancelamentos e pedidos de privacidade (LGPD). OBRIGATÓRIO antes de publicar

  // =============== ORDER BUMP: App Gerador de Plano (no checkout)
  bump: {
    item: "app",
    preco: "R$27",                 // SUGESTÃO
    planos: "3",                   // SUGESTÃO: quantos planos o app gera
    garantiaCobreApp: null         // true/false quando confirmar se a garantia de 7 dias cobre o App
  },

  // =============== UPSELL: Acompanhamento com o Daniel (upsell.html)
  upsell: {
    item: "acompanhamento",
    preco: "R$297",                // SUGESTÃO
    parcelamento: "",              // ex.: "ou 12x de R$ 30,72"
    encontros: "4",                // SUGESTÃO: um por fase do método
    formato: "em grupo",           // SUGESTÃO
    suporteDiaD: "pelo grupo do WhatsApp",  // SUGESTÃO
    datasConfirmadas: true,        // SUGESTÃO: um encontro por fase (confirmar com o Daniel)
    vagas: "",                     // só preencha se houver limite REAL de vagas
    youtubeId: "",                 // vídeo curto do Daniel explicando o acompanhamento
    recusarUrl: "downsell.html"    // quem diz "não" vai para o downsell
  },

  // =============== DOWNSELL 1: Acompanhamento Essencial, com desconto (downsell.html)
  downsell: {
    item: "essencial",
    preco: "R$147",                // SUGESTÃO (o preço "de" vem de upsell.preco)
    parcelamento: "",              // ex.: "ou 12x de R$ 15,20"
    encontros: "2",                // SUGESTÃO
    quais: "a preparação e a véspera do Dia D",  // SUGESTÃO
    recusarUrl: "comunidade.html"
  },

  // =============== DOWNSELL 2: Comunidade (comunidade.html)
  comunidade: {
    item: "comunidade",
    preco: "R$47",                 // SUGESTÃO
    condicao: "pagamento único, acesso até 31/12",  // SUGESTÃO
    ondeFica: "grupo no WhatsApp", // SUGESTÃO
    duvidas: "de segunda a sexta, em horário comercial", // SUGESTÃO
    recusarUrl: "obrigado.html"
  },

  // =============== PÁGINA DE OBRIGADO (obrigado.html)
  obrigado: {
    remetente: "",                 // e-mail que envia o acesso (o da Ticto)
    grupoAvisosUrl: "",            // link do grupo de avisos (WhatsApp/Telegram)
    suporte: "",                   // ex.: "WhatsApp (63) 90000-0000"
    plataformaUrl: "https://universidadedosnegocios.ticto.club/play"   // área de membros (Ticto)
  },

  // =============== VÍDEO DA PÁGINA DE VENDAS E TRAVA
  video: { youtubeId: "EC-WfhAFlQs", mp4: "assets/video/black-explosiva.mp4", poster: "assets/img/poster.jpg" },
  liberarEm: 0.8,                  // fração do vídeo para abrir a página (0.8 = 80%)
  gtmId: ""                        // ex.: "GTM-XXXXXXX" (carrega só após consentimento)
};
