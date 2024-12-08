document.addEventListener('DOMContentLoaded', () => {
    const tableHead = document.querySelector('#data-table thead tr');
    const tableBody = document.querySelector('#data-table tbody');
    const searchInput = document.querySelector('#search');
    const map = L.map('map').setView([37.5665, 126.9780], 13); // Default to Seoul

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    function loadData(file, callback) {
        Papa.parse(file, {
            download: true,
            header: true,
            complete: callback
        });
    }

    function populateTable(data) {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        if (data.length > 0) {
            Object.keys(data[0]).forEach(key => {
                const th = document.createElement('th');
                th.textContent = key;
                tableHead.appendChild(th);
            });

            data.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach(value => {
                    const td = document.createElement('td');
                    td.textContent = value;
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        }
    }

    function populateMap(data) {
        data.forEach(row => {
            if (row.FCLTY_LA && row.FCLTY_LO) {
                L.marker([row.FCLTY_LA, row.FCLTY_LO])
                    .addTo(map)
                    .bindPopup(row.FCLTY_NM || 'Unknown');
            }
        });
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredData = data.filter(row => 
            Object.values(row).some(value => 
                value.toLowerCase().includes(searchTerm)
            )
        );
        populateTable(filteredData);
    });

    loadData('sisul.csv', result => {
        const data = result.data;
        populateTable(data);
        populateMap(data);
    });
});
