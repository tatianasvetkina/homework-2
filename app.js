const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;


let data;

const serviceForm = document.querySelector('#service-form');
const dataError = document.querySelector('#data-error');

try {
    data = JSON.parse(sourceJson);
    serviceForm.hidden = false;
    dataError.hidden = true;
} catch (error) {
    dataError.innerHTML = 'Ошибка данных.';
    dataError.hidden = false;
    serviceForm.hidden = true;
}



function buildReport(services, guideChecked, audioChecked, catalogChecked) {

    const selectedServices = services.filter(service => {
        return (
            (service.id === 'guide' && guideChecked) ||
            (service.id === 'audio' && audioChecked) ||
            (service.id === 'catalog' && catalogChecked)
        );
    });


    const items = selectedServices.map(service => {
        const { title, price } = service;

        return {
            title: title.trim(),
            price: price
        };
    });

    const total = items.reduce((sum, item) => {
        return sum + item.price;
    }, 0);

    return {
        count: items.length,
        total: total,
        items: items
    };
}


const showProgramButton = document.querySelector('#show-program');
const program = document.querySelector('#program');

function showProgram() {
    if (data) {
        program.innerHTML = data.event.meeting;
        program.hidden = false;
    }
}

showProgramButton.addEventListener('click', showProgram);


const guide = document.querySelector('#guide');
const audio = document.querySelector('#audio');
const catalog = document.querySelector('#catalog');

const choiceError = document.querySelector('#choice-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

function handleSubmit(event) {
    event.preventDefault();

    const guideChecked = guide.checked;
    const audioChecked = audio.checked;
    const catalogChecked = catalog.checked;

    const report = buildReport(
        data.services,
        guideChecked,
        audioChecked,
        catalogChecked
    );

    if (report.count === 0) {
        choiceError.innerHTML = 'Выберите хотя бы одну услугу.';
        choiceError.hidden = false;

        result.hidden = true;
        reportJson.hidden = true;
        return;
    }

    choiceError.hidden = true;

    const serviceNames = report.items.map(item => item.title);

    result.innerHTML =
        `Выбрано услуг: ${report.count}<br>` +
        `Итого: ${report.total} руб.<br>` +
        serviceNames.join('<br>');

    result.hidden = false;

    const jsonString = JSON.stringify(report);
    JSON.parse(jsonString);

    reportJson.textContent = jsonString;
    reportJson.hidden = false;
}

serviceForm.addEventListener('submit', handleSubmit);
