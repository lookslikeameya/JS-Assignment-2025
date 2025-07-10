let allCategories = [];
let allItems = [];
const [catRes, itemRes] = await Promise.all([
  fetch('http://43.205.110.71:8000/categories'),
  fetch('http://43.205.110.71:8000/items')
]);
allCategories = await catRes.json();
allItems = await itemRes.json();
console.log(allItems);