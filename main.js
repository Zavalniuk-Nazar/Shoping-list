const htmlElements = {
    'btn del clone': document.querySelector('.button.delete-clone'),
    'input clone': document.querySelector('.input.price-clone'),
    'text clone': document.querySelector('.text-clone'),
    'content': document.querySelector('.content'),
    'total price': document.querySelector('.total-price-text'),
    'list': document.querySelector('.list'),
    'block del all': document.querySelector('.remove-item-list'),
};

const counter = {
    'count': 1,
    getCount() { return this.count; },
    setCount(count) { this.count = count; },
};

const listPrice = {};
const valueGoodsCollected = {};

function changeTheme() {
    const htmlElements = [
        document.querySelector('.page'),
        document.querySelector('.total-price'),
        document.querySelector('.information-window-row'),
        document.querySelector('.information-text'),
        document.querySelector('.confirm-remove-list-body'),
        document.querySelectorAll('.text'),
        document.querySelectorAll('.input'),
        document.querySelectorAll('.placeholder'),
        document.querySelectorAll('.list-item'),
        document.querySelectorAll('.checkbox'),
        document.querySelectorAll('.square'),
        document.querySelectorAll('.button')
    ];

    const arrLength = htmlElements.length;

    for (let i = 0; i < arrLength; i++) {
        if (i >= 5) {
            htmlElements[i].forEach(item => {
                item.classList.toggle('dark-theme');
            });
        } else {
            htmlElements[i].classList.toggle('dark-theme');
        }
    }
}

function assignASerialNumberElements() {
    let count = counter.getCount();

    const htmlElements = [
        document.querySelectorAll('.list-item'),
        document.querySelectorAll('.list-item-row'),
        document.querySelectorAll('.checkbox-button'),
        document.querySelectorAll('.text'),
        document.querySelectorAll('.input-price-row'),
        document.querySelectorAll('.input.price'),
        document.querySelectorAll('.button.delete'),
    ];

    htmlElements.forEach(item => {
        let currentClass = item[item.length - 1].getAttribute('class');
        let replacedClass = `num${count} ${currentClass}`;
        item[item.length - 1].setAttribute('class', replacedClass);
    });
}

function createListItem(textContent) {
    let count = counter.getCount();

    let listItem = document.querySelector('.only-for-js');
    const spanText = document.querySelector('.text');
    spanText.textContent = textContent;
    let listItemClone = listItem.cloneNode(true);

    listItemClone.classList.remove('only-for-js');
    htmlElements['list'].appendChild(listItemClone);
    assignASerialNumberElements();
    counter.setCount(++count);
}

function deployWindow(name) {
    let htmlBlock;
    let htmlBody;

    if (name === 'information') {
        htmlBlock = document.querySelector('.information-window');
        htmlBody = document.querySelector('.information-window-row');
    } else if (name === 'confirm') {
        htmlBlock = document.querySelector('.confirm-remove-list');
        htmlBody = document.querySelector('.confirm-remove-list-body');
    }

    htmlBlock.classList.replace('collapsed', 'deployed');
    setTimeout(() => {
        htmlBody.classList.replace('collapsed', 'deployed');
    }, 1);
}

function collapseWindow(name) {
    let htmlBlock;
    let htmlBody;

    if (name === 'information') {
        htmlBlock = document.querySelector('.information-window');
        htmlBody = document.querySelector('.information-window-row');
    } else if (name === 'confirm') {
        htmlBlock = document.querySelector('.confirm-remove-list');
        htmlBody = document.querySelector('.confirm-remove-list-body');
    }

    htmlBody.classList.replace('deployed', 'collapsed');
    setTimeout(() => {
        htmlBlock.classList.replace('deployed', 'collapsed');
    }, 400);
}

function fillInfoWindow(serialNumber) {
    let liText = document.querySelector(`.${serialNumber}.text`);
    let liInput = document.querySelector(`.${serialNumber}.input.price`);

    htmlElements['text clone'].textContent = liText.textContent;
    htmlElements['input clone'].value = liInput.value;

    const currentClassInputClone = htmlElements['input clone'].getAttribute('class');
    const currentClassBtnDelClone = htmlElements['btn del clone'].getAttribute('class');

    htmlElements['input clone'].setAttribute('class', `${serialNumber} ${currentClassInputClone}`);
    htmlElements['btn del clone'].setAttribute('class', `${serialNumber} ${currentClassBtnDelClone}`);
}

function deleteListItems() {
    const listItems = document.querySelectorAll('.list-item');
    const jsOnlyElementClass = document.querySelector('.only-for-js').getAttribute('class');

    listItems.forEach(item => {
        let itemClass = item.getAttribute('class');
        if (itemClass !== jsOnlyElementClass) {
            item.parentNode.removeChild(item);
        }
    });

    htmlElements['block del all'].classList.add('only-for-js');
    counter.setCount(1);
}

function deleteListItem(serialNumber) {
    let listItem = document.querySelector(`.${serialNumber}.list-item`);

    listItem.parentNode.removeChild(listItem);
    delete valueGoodsCollected[serialNumber];
    delete listPrice[serialNumber];
    calculatePrice();

    let listItems = document.querySelectorAll('.list-item');

    if (listItems.length === 3) {
        htmlElements['block del all'].classList.add('only-for-js');
    }

    if (listItems.length === 1) {
        counter.setCount(1)
    }
}

function setPrice(input, serialNumber, checkbox) {
    let isNumberFloat = input.value.indexOf('.') !== -1;
    let indexDot = input.value.indexOf('.');
    let valueInNumber;

    if (isNumberFloat) {
        valueInNumber = Number(input.value.slice(0, (indexDot + 3)));
    } else {
        valueInNumber = Number(input.value);
    }

    listPrice[serialNumber] = valueInNumber.toFixed(2);
    input.value = listPrice[serialNumber];

    if (checkbox.checked) {
        valueGoodsCollected[serialNumber] = listPrice[serialNumber];
        calculatePrice();
    }
}

function calculatePrice() {
    let result = 0;

    for (let value in valueGoodsCollected) {
        result += Number(valueGoodsCollected[value]);
    }

    htmlElements['total price'].textContent = `Total Price: ${result.toFixed(2)}`;
}

function clearCalculations() {
    for (let value in valueGoodsCollected) {
        delete valueGoodsCollected[value];
    }

    for (let value in listPrice) {
        delete listPrice[value];
    }

    htmlElements['total price'].textContent = 'Total Price: 0.00';
}

function mark(checkbox, serialNumber) {
    let liText = document.querySelector(`.${serialNumber}.text`);

    if (checkbox.checked) {
        liText.classList.add('done');
        let isPriceSet = serialNumber in listPrice;

        if (isPriceSet) {
            valueGoodsCollected[serialNumber] = listPrice[serialNumber];
            calculatePrice();
        }
    } else {
        liText.classList.remove('done');
        delete valueGoodsCollected[serialNumber];
        calculatePrice();
    }
}

function handleClick(event) {
    let serialNumber

    switch (event.target) {
        case (event.target.closest('.button.remove-item-list')):
            deployWindow('confirm');
            break;
        case (event.target.closest('.button.yes')):
            collapseWindow('confirm');
            setTimeout(deleteListItems, 200);
            setTimeout(clearCalculations, 200);
            break;
        case (event.target.closest('.button.no')):
            collapseWindow('confirm');
            break;
        case (event.target.closest('.button.collapse')):
            serialNumber = htmlElements['btn del clone'].classList[0];

            htmlElements['btn del clone'].classList.remove(serialNumber);
            htmlElements['input clone'].classList.remove(serialNumber);
            collapseWindow('information');
            break;
        case (event.target.closest('.button.delete-clone')):
            serialNumber = event.target.classList[0];

            deleteListItem(serialNumber);
            htmlElements['btn del clone'].classList.remove(serialNumber);
            htmlElements['input clone'].classList.remove(serialNumber);
            collapseWindow('information');
            break;
        case (event.target.closest('.text') || event.target.closest('.list-item-row') || event.target.closest('.list-item')):
            serialNumber = event.target.classList[0];

            fillInfoWindow(serialNumber);
            deployWindow('information');
            break;
        case (event.target.closest('.button.delete')):
            serialNumber = event.target.classList[0];

            deleteListItem(serialNumber);
            break;
    }
}

function keydown(event) {
    switch (event.target) {
        case (event.target.closest('.item-input')):
            if (event.keyCode === 13) {
                let text = event.target.value;
                let listItems = document.querySelectorAll('.list-item');

                createListItem(text);
                event.target.value = '';

                if (listItems.length === 3) {
                    htmlElements['block del all'].classList.remove('only-for-js');
                }
            }
            break;
        case (event.target.closest('.input.price') || event.target.closest('.input.price-clone')):
            const availableChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
            const availableKeyCode = [8, 9, 17, 13, 37, 39, 67, 65, 86];
            let hasInvalidChars = !(availableChars.includes(event.key));
            let hasInvalidKeyCode = !(availableKeyCode.includes(event.keyCode));

            if (hasInvalidChars && hasInvalidKeyCode) {
                event.preventDefault();
            }

            if (event.keyCode === 13) {
                event.target.blur();
            }
            break;
    }
}

function input(event) {
    if (event.target.closest('.input.price') || event.target.closest('.input.price-clone')) {
        const input = event.target;
        input.value = input.value.replace(',', '.');

        if (isNaN(Number(input.value))) {
            input.value = '';
        }
    }

    if (event.target.closest('.item-input')) {
        const input = event.target;
        let value = input.value;

        input.value = value.charAt(0).toUpperCase() + value.slice(1);
    }
}

function change(event) {
    let serialNumber;
    let liInput;
    let liCheckox;

    switch (event.target) {
        case (event.target.closest('.switch-button')):
            changeTheme();
            break;
        case (event.target.closest('.checkbox-button')):
            serialNumber = event.target.classList[0];
            liCheckox = event.target;

            mark(liCheckox, serialNumber);
            break;
        case (event.target.closest('.input.price')):
            liInput = event.target;
            serialNumber = liInput.classList[0];
            liCheckox = document.querySelector(`.${serialNumber}.checkbox-button`)

            setPrice(liInput, serialNumber, liCheckox);
            break;
        case (event.target.closest('.input.price-clone')):
            inputClone = event.target;
            serialNumber = inputClone.classList[0];
            liInput = document.querySelector(`.${serialNumber}.input.price`);
            liCheckox = document.querySelector(`.${serialNumber}.checkbox-button`);

            setPrice(inputClone, serialNumber, liCheckox);
            liInput.value = listPrice[serialNumber];
            break;
    }
}

htmlElements['content'].addEventListener('click', handleClick);
htmlElements['content'].addEventListener('keydown', keydown);
htmlElements['content'].addEventListener('input', input);
htmlElements['content'].addEventListener('change', change);