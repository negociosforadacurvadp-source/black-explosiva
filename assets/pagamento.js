/*
  Pagamento direto com Mercado Pago (usado por checkout.html e pagar.html).
  • Cartão: os campos (número, nome, validade, CVV, parcelas) são do Mercado Pago (Card Payment Brick).
    O número do cartão nunca passa pelo nosso servidor: o navegador recebe só um token.
  • Pix: o servidor gera o QR Code; a página acompanha até o Mercado Pago confirmar.
  • O acesso só é liberado quando o Mercado Pago confirma (webhook verificado no servidor).
  Sem mpPublicKey/apiUrl na configuração, roda em MODO DE TESTE (nada é cobrado).
*/
(function () {
  var O = window.OFERTA || {};
  var P = O.pagamento || {};
  var ativo = !!(P.mpPublicKey && P.apiUrl);

  function carregarSdk() {
    return new Promise(function (ok, erro) {
      if (window.MercadoPago) return ok();
      var s = document.createElement('script');
      s.src = 'https://sdk.mercadopago.com/js/v2';
      s.onload = ok; s.onerror = function () { erro(new Error('Não foi possível carregar o Mercado Pago.')); };
      document.head.appendChild(s);
    });
  }

  // Monta os campos do cartão no elemento #id. Retorna { obterDados(), atualizarValor(reais) }.
  async function montarCartao(id, valorReais) {
    if (!ativo) return null;
    await carregarSdk();
    var mp = new window.MercadoPago(P.mpPublicKey, { locale: 'pt-BR' });
    var bricks = mp.bricks();
    var controle = await bricks.create('cardPayment', id, {
      initialization: { amount: valorReais },
      customization: {
        visual: { hidePaymentButton: true, hideFormTitle: true, style: { theme: 'default' } },
        paymentMethods: { maxInstallments: P.maxParcelas || 12 }
      },
      callbacks: { onReady: function () {}, onSubmit: function () {}, onError: function (e) { console.warn('cartão', e); } }
    });
    return {
      obterDados: async function () {
        var d = await controle.getFormData();
        if (!d || !d.token) throw new Error('Confira os dados do cartão.');
        return { token: d.token, payment_method_id: d.payment_method_id, issuer_id: d.issuer_id, parcelas: d.installments };
      },
      atualizarValor: function (reais) { try { controle.update({ amount: reais }); } catch (e) { /* versão sem update */ } }
    };
  }

  async function criarPagamento(corpo) {
    var r = await fetch(P.apiUrl.replace(/\/$/, '') + '/funil-pagamento', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo)
    });
    var j = await r.json().catch(function () { return {}; });
    if (!r.ok) throw new Error(j.erro || 'Não foi possível processar o pagamento.');
    return j;
  }

  // Consulta o status até "pago" (ou desistir). Chama aoPagar() uma vez.
  function acompanhar(token, aoPagar, aoFalhar) {
    var tentativas = 0, parado = false;
    function passo() {
      if (parado) return;
      tentativas++;
      fetch(P.apiUrl.replace(/\/$/, '') + '/funil-status?pedido=' + encodeURIComponent(token), { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.status === 'pago') { parado = true; aoPagar(); return; }
          if (j.status === 'recusado' || j.status === 'cancelado') { parado = true; aoFalhar && aoFalhar(j.status); return; }
          setTimeout(passo, tentativas < 60 ? 4000 : 10000);
        })
        .catch(function () { setTimeout(passo, 8000); });
    }
    setTimeout(passo, 3000);
    return function () { parado = true; };
  }

  // Guarda o pedido para o upsell reaproveitar os dados (só o token; nada de dado pessoal)
  function lembrarPedido(token) { try { sessionStorage.setItem('bfx_pedido', token); } catch (e) {} }
  function pedidoLembrado() { try { return sessionStorage.getItem('bfx_pedido'); } catch (e) { return null; } }

  window.PAGAMENTO = { ativo: ativo, montarCartao: montarCartao, criarPagamento: criarPagamento, acompanhar: acompanhar, lembrarPedido: lembrarPedido, pedidoLembrado: pedidoLembrado };
})();
