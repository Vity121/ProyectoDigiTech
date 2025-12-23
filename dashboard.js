let productionChart;
let currentCategory = 'total';

// Colores de identidad por categoría (ESTOS SON LOS COLORES BASE)
const categoryColors = {
  total: { border: '#1a8825', bg: 'rgba(200, 230, 201, 0.5)' },
  calles: { border: '#0288d1', bg: 'rgba(2, 136, 209, 0.5)' },
  ciudadano: { border: '#fbc02d', bg: 'rgba(251, 192, 45, 0.5)' },
  empresas: { border: '#7b1fa2', bg: 'rgba(123, 31, 162, 0.5)' },
  ropa: { border: '#009688', bg: 'rgba(0, 150, 136, 0.5)' }
};

(() => {
  'use strict'

  const days31 = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const days90 = Array.from({ length: 90 }, (_, i) => `${i + 1}`);

  const dataSets = {
    calles: [80, 85, 82, 90, 100, 95, 70, 75, 80, 85, 100, 110, 105, 70, 65, 85, 90, 95, 100, 105, 110, 108, 75, 72, 90, 95, 100, 105, 110, 115, 120],
    ciudadano: [140, 150, 145, 155, 170, 165, 120, 135, 145, 155, 180, 190, 185, 130, 125, 155, 165, 175, 185, 195, 205, 200, 135, 130, 165, 175, 185, 195, 205, 215, 220],
    empresas: [180, 185, 183, 185, 190, 190, 170, 175, 185, 195, 200, 210, 210, 160, 150, 180, 195, 200, 215, 225, 230, 232, 160, 150, 185, 195, 205, 210, 220, 225, 235],
    ropa: [50, 50, 50, 50, 60, 60, 40, 45, 50, 55, 70, 70, 70, 50, 50, 60, 60, 60, 60, 65, 65, 60, 50, 48, 60, 65, 70, 70, 75, 75, 75]
  };

  dataSets.total = dataSets.calles.map((num, idx) => num + dataSets.ciudadano[idx] + dataSets.empresas[idx] + dataSets.ropa[idx]);

  const ctx1 = document.getElementById('chartProduction').getContext('2d');
  productionChart = new Chart(ctx1, {
    type: 'line',
    data: { labels: days31, datasets: [{ label: 'TOTAL', data: dataSets.total, borderColor: categoryColors.total.border, borderWidth: 3, tension: 0.3, fill: true, backgroundColor: categoryColors.total.bg, pointRadius: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, min: 0 } } }
  });

  window.updateProductionChart = (category, btn) => {
    currentCategory = category;
    productionChart.data.datasets = [{ label: category.toUpperCase(), data: dataSets[category], borderColor: categoryColors[category].border, borderWidth: 3, tension: 0.3, fill: true, backgroundColor: categoryColors[category].bg, pointRadius: 0 }];
    productionChart.update();
    btn.parentElement.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  window.hoverSubcategory = (category) => {
    if (currentCategory === 'total' && category !== 'total') {
      const keys = ['calles', 'ciudadano', 'empresas', 'ropa'];
      const hoverDatasets = keys.map(key => ({
        label: key.toUpperCase(),
        data: dataSets[key],
        borderColor: categoryColors[key].border,
        borderWidth: (key === category) ? 3 : 1.5,
        tension: 0.3,
        fill: (key === category),
        backgroundColor: (key === category) ? categoryColors[key].bg : 'transparent',
        pointRadius: 0
      }));
      hoverDatasets.unshift({ label: 'TOTAL REF', data: dataSets.total, borderColor: '#cbd5e1', borderWidth: 1, fill: false, pointRadius: 0 });
      productionChart.data.datasets = hoverDatasets;
      productionChart.update('none');
    }
  };

  window.leaveSubcategory = () => {
    if (currentCategory === 'total') {
      window.updateProductionChart('total', document.querySelector('.btn-total'));
    }
  };

  const quarterlyData = Array.from({ length: 90 }, (_, i) => Math.round(150 + (i * 1.2) + Math.sin(i * 0.2) * 25));
  const ctx2 = document.getElementById('chartNetBalance').getContext('2d');
  new Chart(ctx2, {
    type: 'line',
    data: { labels: days90, datasets: [
      { label: '1er Mes', data: quarterlyData.map((v, i) => i < 30 ? v : null), backgroundColor: '#e8f5e9', fill: true, tension: 0.3, pointRadius: 0 },
      { label: '2do Mes', data: quarterlyData.map((v, i) => (i >= 29 && i < 60) ? v : null), backgroundColor: '#c8e6c9', fill: true, tension: 0.3, pointRadius: 0 },
      { label: '3er Mes', data: quarterlyData.map((v, i) => i >= 59 ? v : null), backgroundColor: '#a5d6a7', fill: true, tension: 0.3, pointRadius: 0 }
    ]},
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
      scales: { x: { ticks: { callback: (v, i) => i === 15 ? '1er mes' : i === 45 ? '2do mes' : i === 75 ? '3er mes' : null } } }
    }
  });

  document.querySelectorAll('.province-row').forEach(row => {
    row.addEventListener('click', () => {
      row.classList.toggle('expanded');
      document.querySelectorAll(`.breakdown-row.${row.getAttribute('data-target')}`).forEach(sub => sub.style.display = (sub.style.display === 'none' ? 'table-row' : 'none'));
    });
  });
})();