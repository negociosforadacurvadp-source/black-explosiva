/* Lógica compartilhada do funil: checkout, upsell, downsell e obrigado */
(function () {
  var O = window.OFERTA || {};
  var qs = new URLSearchParams(location.search);
  var teste = qs.get('teste') === '1';

  // lê "upsell.preco" etc.
  function get(caminho) {
    return caminho.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, O);
  }
  function tem(caminho) { var v = get(caminho); return v === true || !!(v && String(v).trim()); }

  // Modo configuração: entra sozinho enquanto faltar o que a página exige (data-requer no <body>),
  // ou com ?revisao=1. Mostra em vermelho o que falta, em vez de esconder.
  var requer = (document.body.getAttribute('data-requer') || '').split(' ').filter(Boolean);
  var revisao = qs.get('revisao') === '1' || requer.some(function (k) { return !tem(k); });
  if (revisao) {
    document.documentElement.classList.add('revisao');
    var bar = document.querySelector('.revbar');
    if (bar) bar.textContent = window.OFERTA
      ? 'Modo configuração: preencha em assets/config.js o que está marcado em vermelho. Esta faixa some quando estiver tudo configurado.'
      : 'Configuração não carregada: abra pelo endereço http://localhost:5180 (atalho ABRIR-PAGINA.bat), não direto do arquivo.';
  }

  // UTMs: as mesmas guardadas pela página de vendas
  var origem = {};
  try { origem = JSON.parse(sessionStorage.getItem('bfx_utm') || '{}'); } catch (e) {}
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck'].forEach(function (k) {
    if (qs.get(k) && !origem[k]) origem[k] = qs.get(k);
  });
  try { sessionStorage.setItem('bfx_utm', JSON.stringify(origem)); } catch (e) {}

  window.dataLayer = window.dataLayer || [];
  function track(evento, extra) {
    window.dataLayer.push(Object.assign({ event: evento, pagina: document.body.getAttribute('data-pagina'), teste: teste }, origem, extra || {}));
  }
  function comUtm(url) {
    var u = new URL(url, location.href);
    Object.keys(origem).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, origem[k]); });
    return u.toString();
  }

  // Link da Ticto com os parâmetros que chegaram nesta página (a Ticto identifica o comprador por eles
  // no upsell de 1 clique) e as UTMs da visita.
  function repassar(url) {
    var u = new URL(url, location.href);
    qs.forEach(function (v, k) { if (k !== 'teste' && k !== 'revisao' && !u.searchParams.has(k)) u.searchParams.set(k, v); });
    Object.keys(origem).forEach(function (k) { if (!u.searchParams.has(k)) u.searchParams.set(k, origem[k]); });
    return u.toString();
  }

  // Liga um botão/link ao destino real; sem destino real, usa o caminho de teste (nenhum pagamento acontece).
  function ligar(el, urlReal, urlTeste, evento, rotuloTeste) {
    if (urlReal) {
      el.href = repassar(urlReal);
    } else {
      var u = new URL(urlTeste, location.href);
      if (teste || rotuloTeste) u.searchParams.set('teste', '1');
      el.href = u.pathname.split('/').pop() + u.search;
      if (rotuloTeste) { el.setAttribute('data-teste', '1'); el.firstChild.nodeValue = rotuloTeste; }
    }
    el.addEventListener('click', function () { track(evento + (el.hasAttribute('data-teste') ? '_teste' : '')); });
  }

  // data-f="caminho": preenche o texto (data-f-pre / data-f-pos: prefixo e sufixo)
  document.querySelectorAll('[data-f]').forEach(function (el) {
    var v = get(el.getAttribute('data-f'));
    if (v && v !== true) el.textContent = (el.getAttribute('data-f-pre') || '') + v + (el.getAttribute('data-f-pos') || '');
  });
  // data-pendente + data-se="caminho1 caminho2": some do público até todos existirem
  document.querySelectorAll('[data-pendente]').forEach(function (el) {
    var req = (el.getAttribute('data-se') || '').split(' ').filter(Boolean);
    if (req.length && req.every(tem)) el.removeAttribute('data-pendente');
  });

  // Faixa de teste no topo das páginas pós-compra
  var ok = document.querySelector('.ok-bar');
  if (ok && teste) { ok.hidden = false; ok.classList.add('teste'); ok.innerHTML = '<b>Teste:</b> compra simulada. Nenhum pagamento foi feito.'; }

  window.BFX = {
    O: O, get: get, tem: tem, track: track, comUtm: comUtm, repassar: repassar, ligar: ligar,
    revisao: revisao, teste: teste, encerrado: Date.now() > new Date(O.vendasAte).getTime()
  };
  track('page_view');
})();
