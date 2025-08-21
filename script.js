
// Background music toggle (lightweight, our own ambient loop)
const audio = document.getElementById('bgm');
const audioToggle = document.getElementById('audioToggle');
let audioOn = false;
audioToggle?.addEventListener('click', () => {
  audioOn = !audioOn;
  if(audioOn){ audio.volume = 0.3; audio.play(); audioToggle.textContent = '♫ On'; }
  else { audio.pause(); audioToggle.textContent = '♫'; }
});

// Hero slider
const slider = document.getElementById('slider');
const dots = document.getElementById('dots');
let index = 0;
const slides = document.querySelectorAll('.slide');
slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.addEventListener('click', () => go(i));
  dots.appendChild(b);
});
function go(i){
  index = i % slides.length;
  slider.style.transform = `translateX(-${index*100}%)`;
  [...dots.children].forEach((d,di)=>d.classList.toggle('active', di===index));
}
setInterval(()=>{ go((index+1)%slides.length); }, 4500);
go(0);

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  })
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Back to top
document.getElementById('toTop')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Cart logic using localStorage
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const drawer = document.getElementById('cartDrawer');
const backdrop = document.getElementById('backdrop');
const itemsEl = document.getElementById('cartItems');
const totalEl = document.getElementById('cartTotal');
const countEl = document.getElementById('cartCount');

function getCart(){
  return JSON.parse(localStorage.getItem('naivest_cart')||'[]');
}
function setCart(cart){
  localStorage.setItem('naivest_cart', JSON.stringify(cart));
  renderCart();
}
function addToCart(product){
  const cart = getCart();
  const found = cart.find(i=>i.id===product.id);
  if(found){ found.qty += 1; }
  else cart.push({...product, qty:1});
  setCart(cart);
}
function changeQty(id, delta){
  const cart = getCart();
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty<=0) cart.splice(cart.indexOf(it),1);
  setCart(cart);
}
function formatRupiah(n){
  return 'Rp' + n.toLocaleString('id-ID');
}
function renderCart(){
  const cart = getCart();
  itemsEl.innerHTML = cart.map(i=>`
    <div class="cart-item">
      <img src="${i.img}" alt="${i.name}">
      <div>
        <h5>${i.name}</h5>
        <div class="qty">
          <button aria-label="kurangi" onclick="changeQty('${i.id}', -1)">–</button>
          <span>${i.qty}</span>
          <button aria-label="tambah" onclick="changeQty('${i.id}', 1)">+</button>
        </div>
      </div>
      <div>${formatRupiah(i.price*i.qty)}</div>
    </div>
  `).join('');
  const total = cart.reduce((a,b)=>a+b.price*b.qty,0);
  totalEl.textContent = formatRupiah(total);
  countEl.textContent = cart.reduce((a,b)=>a+b.qty,0);
}
window.changeQty = changeQty;
renderCart();

document.querySelectorAll('.btn.add').forEach(b=>{
  b.addEventListener('click', ()=>{
    addToCart({
      id: b.dataset.id,
      name: b.dataset.name,
      price: Number(b.dataset.price),
      img: b.dataset.img
    });
    openDrawer();
  });
});

function openDrawer(){ drawer.classList.add('open'); backdrop.classList.add('show'); }
function closeDrawer(){ drawer.classList.remove('open'); backdrop.classList.remove('show'); }
openCartBtn?.addEventListener('click', openDrawer);
closeCartBtn?.addEventListener('click', closeDrawer);
backdrop?.addEventListener('click', closeDrawer);
