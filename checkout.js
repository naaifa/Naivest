
function formatRupiah(n){ return 'Rp' + n.toLocaleString('id-ID'); }
function getCart(){ return JSON.parse(localStorage.getItem('naivest_cart')||'[]'); }
function clearCart(){ localStorage.removeItem('naivest_cart'); }

const sumEl = document.getElementById('summary');
const cart = getCart();
if(cart.length===0){
  sumEl.innerHTML = '<p>Keranjang kosong. <a href="index.html">Belanja dulu</a>.</p>';
}else{
  let html = '';
  let total = 0;
  cart.forEach(i=>{
    const sub = i.price*i.qty;
    total += sub;
    html += `<div class="row"><span>${i.qty}× ${i.name}</span><b>${formatRupiah(sub)}</b></div>`;
  });
  html += `<div class="row total"><span>Total</span><b>${formatRupiah(total)}</b></div>`;
  sumEl.innerHTML = html;
}

const form = document.getElementById('checkoutForm');
const done = document.getElementById('done');
form?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  // Simulate order creation
  const order = { items: cart, customer: data, createdAt: new Date().toISOString() };
  localStorage.setItem('naivest_last_order', JSON.stringify(order));
  clearCart();
  form.hidden = true;
  done.hidden = false;
  window.scrollTo({top:0,behavior:'smooth'});
});
