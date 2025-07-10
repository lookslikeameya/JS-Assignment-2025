let allCategories = [];
let allItems = [];

async function fetchData() {
  const [catRes, itemRes] = await Promise.all([
    fetch('http://43.205.110.71:8000/categories'),
    fetch('http://43.205.110.71:8000/items')
  ]);
  allCategories = await catRes.json();
  allItems = await itemRes.json();
  renderItems(allItems);
}

function applyFilter() {
  const category = document.querySelector('.categories select').value;
  const tag = document.querySelector('.tags select').value;

  const filtered = allItems.filter(item => {
    const matchesCategory = category === 'all' || item.category === category;
    const matchesTag = tag === 'all' || item.tags.split('|').includes(tag);
    return matchesCategory && matchesTag;
  });

  renderItems(filtered);
}

function renderItems(items) {
  const container = document.getElementById('items-container');
  container.innerHTML = '';
  items.forEach(item => {
    container.innerHTML += `
            <div class="item-card">
                <img src="https://picsum.photos/200?random=${item.id}" >
                <h3>${item.name}</h3>
                <p>${item.description}<br>
                Price: ${item.price}<br>
                Tags: ${item.tags.split('|')}</p>
            </div>
        `;
  });
}


fetchData();

document.querySelector('.categories select').addEventListener('change', applyFilter);
document.querySelector('.tags select').addEventListener('change', applyFilter);