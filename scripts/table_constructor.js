(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('tableForm');
        const tableContainer = document.getElementById('tableContainer');

        loadSettings();

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!validateForm()) {
                showNotification('Пожалуйста, заполните все поля корректно.');
                return;
            }

            const weekType = form.elements['weekType'].value;
            const maxClasses = parseInt(form.elements['maxClasses'].value);
            const language = form.elements['language'].value;
            const startTime = form.elements['startTime'].value;
            const lessonDuration = parseInt(form.elements['lessonDuration'].value);
            const breakDuration = parseInt(form.elements['breakDuration'].value);

            saveSettings(weekType, maxClasses, language, startTime, lessonDuration, breakDuration);

            generateTable(weekType, maxClasses, language, startTime, lessonDuration, breakDuration);
        });

        function showNotification(message) {
            let notification = document.querySelector('.notification');
            if (!notification) {
                notification = document.createElement('div');
                notification.classList.add('notification');
                document.body.appendChild(notification);
            }

            notification.textContent = message;
            notification.style.display = 'block';

            setTimeout(function () {
                notification.classList.add('hidden');
                setTimeout(function () {
                    notification.style.display = 'none';
                    notification.classList.remove('hidden');
                }, 500);
            }, 3000);
        }

        function validateForm() {
            const { weekType, maxClasses, language, startTime, lessonDuration, breakDuration } = form.elements;

            if (!weekType.value || !maxClasses.value || !language.value || !startTime.value || !lessonDuration.value || !breakDuration.value) {
                return false;
            }

            if (maxClasses.value < 1 || maxClasses.value > 10 || lessonDuration.value < 1 || breakDuration.value < 0) {
                return false;
            }

            return /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(startTime.value);
        }

        function saveSettings(weekType, maxClasses, language, startTime, lessonDuration, breakDuration) {
            localStorage.setItem('tableSettings', JSON.stringify({
                weekType,
                maxClasses,
                language,
                startTime,
                lessonDuration,
                breakDuration
            }));
        }

        function loadSettings() {
            const savedSettings = JSON.parse(localStorage.getItem('tableSettings'));
            if (savedSettings) {
                form.elements['weekType'].value = savedSettings.weekType;
                form.elements['maxClasses'].value = savedSettings.maxClasses;
                form.elements['language'].value = savedSettings.language;
                form.elements['startTime'].value = savedSettings.startTime;
                form.elements['lessonDuration'].value = savedSettings.lessonDuration;
                form.elements['breakDuration'].value = savedSettings.breakDuration;
            }
        }

        function generateTable(weekType, maxClasses, language, startTime, lessonDuration, breakDuration) {
            tableContainer.innerHTML = '';
            const table = document.createElement('table');
            table.classList.add('schedule-table');

            const days = language === 'ru'
                ? ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
                : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const dayHeader = document.createElement('th');
            dayHeader.textContent = language === 'ru' ? 'День' : 'Day';
            headerRow.appendChild(dayHeader);

            let currentTime = new Date(`1970-01-01T${startTime}:00`);

            for (let i = 1; i <= maxClasses; i++) {
                const classHeader = document.createElement('th');
                const startTimeStr = currentTime.toTimeString().slice(0, 5);
                currentTime.setMinutes(currentTime.getMinutes() + lessonDuration);
                const endTimeStr = currentTime.toTimeString().slice(0, 5);

                classHeader.innerHTML = `${language === 'ru' ? 'Урок' : 'Class'} ${i}<br><small>${startTimeStr} - ${endTimeStr}</small>`;
                headerRow.appendChild(classHeader);

                if (i < maxClasses) {
                    currentTime.setMinutes(currentTime.getMinutes() + breakDuration);
                }
            }

            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            for (let i = 0; i < (weekType === '5' ? 5 : 6); i++) {
                const row = document.createElement('tr');
                const dayCell = document.createElement('td');
                dayCell.textContent = days[i];
                row.appendChild(dayCell);

                for (let j = 0; j < maxClasses; j++) {
                    const classCell = document.createElement('td');
                    classCell.textContent = '';
                    classCell.contentEditable = "true";

                    classCell.addEventListener('blur', function () {
                        saveTableData();
                    });

                    row.appendChild(classCell);
                }
                tbody.appendChild(row);
            }

            table.appendChild(tbody);
            tableContainer.appendChild(table);

            loadTableData();
        }

        function saveTableData() {
            const table = tableContainer.querySelector('table');
            const tableData = [];
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const rowData = [];
                cells.forEach(cell => {
                    rowData.push(cell.textContent);
                });
                if (rowData.length) {
                    tableData.push(rowData);
                }
            });
            localStorage.setItem('tableData', JSON.stringify(tableData));
        }

        function loadTableData() {
            const savedTableData = JSON.parse(localStorage.getItem('tableData'));
            if (savedTableData) {
                const table = tableContainer.querySelector('table');
                const rows = table.querySelectorAll('tr');
                savedTableData.forEach((rowData, i) => {
                    const cells = rows[i + 1].querySelectorAll('td');
                    rowData.forEach((cellData, j) => {
                        cells[j].textContent = cellData;
                    });
                });
            }
        }

        loadTableData();
    });
})();
