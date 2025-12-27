// ==UserScript==
// @name         Export Channel List to CSV
// @namespace    vm-channel-export
// @version      1.0
// @description  Export channel list items to CSV via button
// @match        http://localhost:*/channels.html
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function createButton() {
    if (document.getElementById('vm-export-csv')) return;

    const btn = document.createElement('button');
    btn.id = 'vm-export-csv';
    btn.textContent = 'Export Channels CSV';

    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '9999',
      padding: '10px 14px',
      background: '#1f6feb',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      boxShadow: '0 4px 10px rgba(0,0,0,.2)'
    });

    btn.addEventListener('click', exportCSV);
    document.body.appendChild(btn);
  }

  function exportCSV() {
    const rows = [];
    rows.push(['Channel Number', 'Channel Name']);

    document.querySelectorAll('.channel-list-item .text-primary').forEach(span => {
      const text = span.textContent.trim();
      if (!text.includes('-')) return;

      const [number, name] = text.split(' - ').map(s => s.trim());
      rows.push([number, name]);
    });

    if (rows.length <= 1) {
      alert('No channels found.');
      return;
    }

    const csv = rows
      .map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'channels.csv';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // wait for page content
  window.addEventListener('load', () => {
    setTimeout(createButton, 500);
  });
})();
