let productionChart;
let balanceChart;
let activeProvince = 'Global';
let activeCategory = 'total';

const colors = {
  total: { border: '#1a8825', bg: 'rgba(200, 230, 201, 0.5)' },
  calles: { border: '#0288d1', bg: 'rgba(2, 136, 209, 0.5)' },
  ciudadano: { border: '#fbc02d', bg: 'rgba(251, 192, 45, 0.5)' },
  empresas: { border: '#7b1fa2', bg: 'rgba(123, 31, 162, 0.5)' },
  ropa: { border: '#009688', bg: 'rgba(0, 150, 136, 0.5)' }
};

const generateData = (f) => {
  const p = [450, 520, 480, 560, 610].map(v => Math.round(v * f));
  return { total: p, calles: p.map(v => Math.round(v*0.2)), ciudadano: p.map(v => Math.round(v*0.3)), empresas: p.map(v => Math.round(v*0.4)), ropa: p.map(v => Math.round(v*0.1)) };
};

const allData = { 
  Madrid: generateData(1.8), Barcelona: generateData(1.7), Valencia: generateData(1.4), Sevilla: generateData(1.2), 
  Zaragoza: generateData(1.0), Málaga: generateData(0.9), Bilbao: generateData(0.95), Murcia: generateData(0.8), 
  Palma: generateData(0.7), LasPalmas: generateData(0.6) 
};

// Global Sum
allData.Global = { total: [0,0,0,0,0], calles: [0,0,0,0,0], ciudadano: [0,0,0,0,0], empresas: [0,0,0,0,0], ropa: [0,0,0,0,0] };
Object.keys(allData).forEach(p => {
  if (p === 'Global') return;
  ['total', 'calles', 'ciudadano', 'empresas', 'ropa'].forEach(cat => {
    allData[p][cat].forEach((v, i) => allData.Global[cat][i] += v);
  });
});

(() => {
  'use strict'
  const ctx1 = document.getElementById('chartProduction').getContext('2d');
  productionChart = new Chart(ctx1, {
    type: 'line',
    data: { labels: ["S1", "S2", "S3", "S4", "S5"], datasets: [{ label: 'TOTAL', data: allData.Global.total, borderColor: colors.total.border, fill: true, backgroundColor: colors.total.bg, tension: 0.3, pointRadius: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });

  // SEGUNDO GRÁFICO: MODIFICADO A TRIMESTRAL (MES 1, 2, 3)
  const ctx2 = document.getElementById('chartBalance').getContext('2d');
  balanceChart = new Chart(ctx2, {
    type: 'line',
    data: { 
      labels: ["Mes 1", "Mes 2", "Mes 3"],
      datasets: [{ 
        label: 'Balance Trimestral', 
        data: [12500, 13800, 15200], // Datos representativos trimestrales
        borderColor: '#2e7d32', 
        fill: true, 
        backgroundColor: 'rgba(46, 125, 50, 0.2)', 
        tension: 0.3, 
        pointRadius: 4 
      }] 
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });

  window.refreshChart = () => {
    const data = allData[activeProvince][activeCategory];
    productionChart.data.datasets = [{ label: activeCategory.toUpperCase(), data: data, borderColor: colors[activeCategory].border, fill: true, backgroundColor: colors[activeCategory].bg, tension: 0.3, pointRadius: 0 }];
    document.getElementById('prodTitle').innerText = `Producción mensual ${activeProvince} (t)`;
    productionChart.update();
  };

  window.updateCategory = (cat, btn) => {
    activeCategory = cat; refreshChart();
    btn.parentElement.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };

  window.hoverSubcategory = (cat) => {
    if (activeCategory === 'total' && cat !== 'total') {
      const keys = ['calles', 'ciudadano', 'empresas', 'ropa'];
      productionChart.data.datasets = keys.map(k => ({
        label: k.toUpperCase(), data: allData[activeProvince][k], borderColor: colors[k].border, borderWidth: (k === cat ? 3 : 1), fill: (k === cat), backgroundColor: (k === cat ? colors[k].bg : 'transparent'), tension: 0.3, pointRadius: 0
      }));
      productionChart.update('none');
    }
  };

  window.leaveSubcategory = () => { if (activeCategory === 'total') refreshChart(); };

  document.querySelectorAll('.province-row').forEach(row => {
    row.addEventListener('click', () => {
      const target = row.getAttribute('data-target');
      const subRows = document.querySelectorAll(`.breakdown-row.${target}`);
      if (subRows[0].style.display !== 'none') {
        subRows.forEach(s => s.style.display = 'none'); row.classList.remove('expanded'); resetToGlobal();
      } else {
        activeProvince = row.getAttribute('data-province').replace(/\s+/g, '');
        subRows.forEach(s => s.style.display = 'table-row'); row.classList.add('expanded'); refreshChart();
      }
    });
  });

  window.resetToGlobal = () => {
    activeProvince = 'Global'; activeCategory = 'total';
    const btn = document.querySelector('.btn-total');
    if(btn) updateCategory('total', btn);
    refreshChart();
  };
})();