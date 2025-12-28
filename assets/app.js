// Shared app JS: sidebar, cart, and category rendering
(function(){
  // Elements used across pages
  var hamburger = document.getElementById('hamburger');
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('overlay');
  var cartButton = document.getElementById('cartButton');
  var cartPanel = document.getElementById('cartPanel');
  var cartCount = document.getElementById('cartCount');
  var cartItemsWrap = document.getElementById('cartItems');
  var cartTotal = document.getElementById('cartTotal');
  var clearCartBtn = document.getElementById('clearCartBtn');
  var checkoutBtn = document.getElementById('checkoutBtn');

  // PRODUCT DATA — central source
  var PRODUCTS = [
    { id:'flower1', name:'Crochet Flower Bouquet', price:499, img:'https://images.unsplash.com/photo-1591369822096-ffd140ec948f', category:'flowers' },
    { id:'keychain1', name:'Crochet Keychain', price:199, img:'https://images.unsplash.com/photo-1591369822096-ffd140ec948f', category:'keychains' },
    { id:'bag1', name:'Crochet Tote Bag', price:1299, img:'https://images.unsplash.com/photo-1591369822096-ffd140ec948f', category:'bags' },
    { id:'top1', name:'Crochet Top', price:999, img:'https://images.unsplash.com/photo-1591369822096-ffd140ec948f', category:'tops' },
    { id:'baby1', name:'Baby Crochet Set', price:899, img:'https://images.unsplash.com/photo-1609234656388-0ff363383899', category:'baby' },
    { id:'home1', name:'Home Décor Crochet', price:699, img:'https://images.unsplash.com/photo-1616627988537-4a2d45b9c41e', category:'home' }
  ];

  // CART logic (localStorage)
  var CART_KEY = 'mwlc_cart_v1';
  var cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function getCartCount(){ return cart.reduce(function(s,i){ return s + (i.qty||0); }, 0); }
  function getCartTotal(){ return cart.reduce(function(s,i){ return s + (i.qty||0) * Number(i.price); }, 0); }
  function updateBadge(){ if(!cartCount) return; var c = getCartCount(); if(c>0){ cartCount.style.display='block'; cartCount.textContent=c; } else { cartCount.style.display='none'; } }

  function renderCart(){ if(!cartItemsWrap) return; cartItemsWrap.innerHTML=''; if(cart.length===0){ cartItemsWrap.innerHTML='<div class="cart-empty">Your cart is empty</div>'; if(cartTotal) cartTotal.textContent='₹0'; return; } cart.forEach(function(item){ var div=document.createElement('div'); div.className='cart-item'; div.innerHTML = '<img src="'+(item.img||'')+'" alt=""><div class="meta"><h4>'+item.name+'</h4><p>₹'+Number(item.price).toLocaleString()+'</p><div style="margin-top:8px;display:flex;gap:6px;align-items:center"><button class="qty-decrease" data-id="'+item.id+'">−</button><input class="qty-input" data-id="'+item.id+'" type="number" min="1" value="'+item.qty+'" style="width:54px;padding:6px;border-radius:6px;border:1px solid #eee;text-align:center"/><button class="qty-increase" data-id="'+item.id+'">+</button></div></div><div style="display:flex;flex-direction:column;gap:6px"><button data-id="'+item.id+'" class="remove-btn">Remove</button></div>'; cartItemsWrap.appendChild(div); }); if(cartTotal) cartTotal.textContent = '₹' + getCartTotal().toLocaleString(); // attach handlers
    Array.from(cartItemsWrap.querySelectorAll('.remove-btn')).forEach(function(btn){ btn.addEventListener('click', function(){ var id=this.getAttribute('data-id'); removeFromCart(id); }); });
    Array.from(cartItemsWrap.querySelectorAll('.qty-increase')).forEach(function(btn){ btn.addEventListener('click', function(){ var id=this.getAttribute('data-id'); changeQty(id, 1); }); });
    Array.from(cartItemsWrap.querySelectorAll('.qty-decrease')).forEach(function(btn){ btn.addEventListener('click', function(){ var id=this.getAttribute('data-id'); changeQty(id, -1); }); });
    Array.from(cartItemsWrap.querySelectorAll('.qty-input')).forEach(function(input){ input.addEventListener('change', function(){ var id=this.getAttribute('data-id'); var v = Number(this.value) || 1; setQty(id, v); }); }); }

  function changeQty(id, delta){ var it = cart.find(function(i){ return i.id===id; }); if(!it) return; it.qty = Math.max(1, (it.qty||0) + delta); saveCart(); updateBadge(); renderCart(); }
  function setQty(id, v){ var it = cart.find(function(i){ return i.id===id; }); if(!it) return; it.qty = Math.max(1, Number(v)||1); saveCart(); updateBadge(); renderCart(); }

  function addToCart(obj, qty){ var quantity = Number(qty) || 1; var existing = cart.find(function(i){ return i.id===obj.id; }); if(existing){ existing.qty = (existing.qty||0) + quantity; } else { obj.qty = quantity; cart.push(obj); } saveCart(); updateBadge(); renderCart(); }
  function removeFromCart(id){ cart = cart.filter(function(i){ return i.id!==id; }); saveCart(); updateBadge(); renderCart(); }
  function clearCart(){ cart = []; saveCart(); updateBadge(); renderCart(); }

  // sidebar/cart toggles and overlay
  function setOverlayVisible(v){ if(!overlay) return; if(v) overlay.classList.add('show'); else overlay.classList.remove('show'); }
  function toggleSidebar(){ if(!sidebar || !hamburger) return; var open = sidebar.classList.toggle('open'); hamburger.classList.toggle('open', open); sidebar.setAttribute('aria-hidden', !open); setOverlayVisible(open || (cartPanel && cartPanel.classList.contains('open'))); }
  function toggleCart(){ if(!cartPanel) return; var open = cartPanel.classList.toggle('open'); cartPanel.setAttribute('aria-hidden', !open); setOverlayVisible(open || (sidebar && sidebar.classList.contains('open'))); }

  if(hamburger){ hamburger.addEventListener('click', toggleSidebar); hamburger.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); toggleSidebar(); } }); }
  if(cartButton){ cartButton.addEventListener('click', function(){ toggleCart(); }); cartButton.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); toggleCart(); } }); }
  if(overlay){ overlay.addEventListener('click', function(){ if(sidebar && sidebar.classList.contains('open')) toggleSidebar(); if(cartPanel && cartPanel.classList.contains('open')) toggleCart(); }); }

  if(clearCartBtn) clearCartBtn.addEventListener('click', function(e){ e.preventDefault(); clearCart(); });
  if(checkoutBtn) checkoutBtn.addEventListener('click', function(e){ e.preventDefault(); alert('Checkout placeholder — integrate payment gateway.'); });

  // Hook add-to-cart buttons that may exist on page (for static index or generated pages)
  function wireAddButtons(){ Array.from(document.querySelectorAll('.add-to-cart')).forEach(function(btn){ btn.addEventListener('click', function(e){ var id = this.dataset.id; var product = PRODUCTS.find(function(p){ return p.id===id; }); if(product){ var qty = 1; var wrapper = this.closest('.card'); if(wrapper){ var q = wrapper.querySelector('.qty-select'); if(q) qty = Number(q.value) || 1; } addToCart({ id:product.id, name:product.name, price:product.price, img:product.img }, qty); } }); }); }

  // Product rendering helper
  function renderProductsList(container, items){ if(!container) return; container.innerHTML=''; if(!items || items.length===0){ container.innerHTML='<p style="text-align:center">No products.</p>'; return; } items.forEach(function(p){ var card = document.createElement('div'); card.className='card'; card.setAttribute('data-id', p.id); card.innerHTML = '<img src="'+p.img+'" alt=""><h3>'+p.name+'</h3><p class="price">₹'+Number(p.price).toLocaleString()+'</p><div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-bottom:12px"><input class="qty-select" type="number" min="1" value="1" style="width:60px;padding:6px;border-radius:8px;border:1px solid #eee;text-align:center"/></div><button class="btn add-to-cart" data-id="'+p.id+'">Add to Cart</button>'; container.appendChild(card); }); wireAddButtons(); }

  // If page has a category container, render products for that category.
  (function renderCategoryIfNeeded(){
    var container = document.getElementById('categoryProducts');
    if(!container) return;
    var cat = (window.INIT_CAT || '');
    if(!cat){ var params = new URLSearchParams(window.location.search); cat = (params.get('cat') || '').toLowerCase(); }
    var titleEl = document.querySelector('#categoryTitle');
    if(titleEl){ titleEl.textContent = (cat || 'All').replace(/(^|\s)\S/g, function(t){return t.toUpperCase();}); }
    var list = (cat ? PRODUCTS.filter(function(p){ return p.category===cat; }) : PRODUCTS);
    renderProductsList(container, list);
  })();

  // initial wiring
  wireAddButtons(); updateBadge(); renderCart();
})();
