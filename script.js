const form = document.getElementById("validationForm");

const validationRules = {
    fullName: {
    regex: /^[\p{L}'’-]+\s+\p{L}\.\s*\p{L}\.$/u,
    message: "Введіть прізвище та ініціали, наприклад: Білий І. С."
    },

    faculty: {
        regex: /^\p{L}{4}$/u,
        message: "Факультет повинен містити чотири літери."
    },

    birthDate: {
        regex: /^\d{2}\.\d{2}\.\d{4}$/,
        message: "Введіть дату у форматі ДД.ММ.РРРР."
    },

    address: {
        regex: /^м\. \d{6}$/,
        message: "Формат адреси: м. 123456."
    },

    email: {
        regex: /^[a-z]{6}@[a-z]{5}\.com$/,
        message: "Формат: шість літер@п'ять літер.com."
    }
};

function isRealDate(value) {
    const parts = value.split(".");

    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = Number(parts[2]);

    if (year < 1 || month < 1 || month > 12) {
        return false;
    }

    const leapYear =
        year % 400 === 0 ||
        (year % 4 === 0 && year % 100 !== 0);

    const daysInMonth = [
        31,
        leapYear ? 29 : 28,
        31, 30, 31, 30,
        31, 31, 30, 31, 30, 31
    ];

    return day >= 1 && day <= daysInMonth[month - 1];
}

function validateField(input) {
    const rule = validationRules[input.id];

    if (!rule) {
        return true;
    }

    const field = input.closest(".form-field");
    const error = field.querySelector(".error-message");
    const value = input.value.trim();

    let valid = rule.regex.test(value);
    let message = rule.message;

    if (value === "") {
        valid = false;
        message = "Це поле обов'язкове.";
    }

    if (valid && input.id === "birthDate") {
        valid = isRealDate(value);

        if (!valid) {
            message = "Такої календарної дати не існує.";
        }
    }

    if (valid) {
        field.classList.remove("invalid");
        error.textContent = "";
        input.removeAttribute("aria-invalid");
    } else {
        field.classList.add("invalid");
        error.textContent = message;
        input.setAttribute("aria-invalid", "true");
    }

    return valid;
}

form.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("input", function () {
        validateField(input);
    });
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const inputs = form.querySelectorAll("input");

    let allValid = true;

    inputs.forEach(function (input) {
        if (!validateField(input)) {
            allValid = false;
        }
    });

    if (!allValid) {
        return;
    }

    const resultWindow = window.open(
        "",
        "_blank",
        "width=500,height=450"
    );

    if (resultWindow === null) {
        alert(
            "Дані правильні:\n" +
            Array.from(inputs)
                .map(input => input.value.trim())
                .join("\n")
        );
        return;
    }

    const doc = resultWindow.document;

    doc.title = "Результати перевірки";

    doc.body.style.fontFamily = "Arial, sans-serif";
    doc.body.style.padding = "20px";

    const heading = doc.createElement("h2");
    heading.textContent = "Дані пройшли перевірку";
    doc.body.appendChild(heading);

    inputs.forEach(function (input) {
        const paragraph = doc.createElement("p");

        const label = form.querySelector(
            'label[for="' + input.id + '"]'
        ).textContent;

        paragraph.textContent =
            label + ": " + input.value.trim();

        doc.body.appendChild(paragraph);
    });
});


const table = document.getElementById("interactiveTable");

const colorPicker = document.getElementById("selectedColor");

const variant = 5;

let number = 1;

for (let row = 0; row < 6; row++) {
    const tr = document.createElement("tr");

    for (let column = 0; column < 6; column++) {
        const td = document.createElement("td");

        td.textContent = number;
        td.dataset.number = number;

        tr.appendChild(td);

        number++;
    }

    table.appendChild(tr);
}

const targetCell = table.querySelector(
    'td[data-number="' + variant + '"]'
);

targetCell.classList.add("target-cell");

function getRandomColor() {
    const randomNumber = Math.floor(
        Math.random() * 16777216
    );

    return "#" + randomNumber.toString(16).padStart(6, "0");
}

targetCell.addEventListener("mouseover", function () {
    targetCell.style.backgroundColor = getRandomColor();
});

targetCell.addEventListener("click", function () {
    targetCell.style.backgroundColor = colorPicker.value;
});

targetCell.addEventListener("dblclick", function () {
    const cells = table.querySelectorAll("td");

    cells.forEach(function (cell) {
        if (cell !== targetCell) {
            cell.style.backgroundColor = colorPicker.value;
        }
    });
});
