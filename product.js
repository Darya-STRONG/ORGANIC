// Отримуємо всі поля вводу кількості товару
const quantityInputs = document.querySelectorAll('.quantity-input');

// Встановлюємо початкове значення для всіх полів вводу та атрибут placeholder
quantityInputs.forEach(input => {
  input.value = ""; // Залишаємо пустим, щоб при завантаженні було видно placeholder

  // Слідкуємо за змінами в полі вводу
  input.addEventListener('input', () => {
    const currentValue = parseInt(input.value);
    
    // Відновлюємо значення до пустого рядка тільки якщо введено 0
    if (currentValue === 0) {
      input.value = "";
    }
  });
});


// Отримуємо всі рядки з товарами
const productRows = document.querySelectorAll('.product-row');
const totalAmountElement = document.getElementById('totalAmount'); // Отримуємо елемент для загальної суми

let totalAmount = 0; // Змінна для зберігання загальної суми

// Функція для обчислення суми на кожній карточці
function calculateSubtotal(row) {
  const priceElement = row.querySelector('.u-price');
  const quantityInput = row.querySelector('.u-quantity-input input');
  const subtotalElement = row.querySelector('.u-cart-product-subtotal .u-price');

  const price = parseFloat(priceElement.textContent);
  const quantity = parseInt(quantityInput.value);
  
  // Перевірка, чи введене значення в quantityInput є числом або не пусте
  if (!isNaN(quantity) && quantityInput.value !== "") {
    const subtotal = price * quantity;
    subtotalElement.textContent = subtotal.toFixed(2) + ' грн';
    updateTotalAmount(); // Оновлюємо загальну суму
  } else {
    subtotalElement.textContent = '0.00 грн'; // Якщо введено нечислове значення або пусто
    updateTotalAmount(); // Оновлюємо загальну суму
  }
}



// Додаємо обробник події для кожної карточки товару
productRows.forEach(row => {
  const quantityInput = row.querySelector('.u-quantity-input input');
  quantityInput.addEventListener('input', () => {
    calculateSubtotal(row);
    updateTotalAmount(); // Оновлюємо загальну суму

  });

  // Викликаємо функцію для першого розрахунку підсумку
  calculateSubtotal(row);
});

// Функція для оновлення загальної суми
function updateTotalAmount() {
  totalAmount = 0; // Обнулюємо загальну суму

  // Проходимось по всім рядкам з товарами та додаємо до загальної суми
  productRows.forEach(row => {
    const quantityInput = row.querySelector('.u-quantity-input input');
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(row.querySelector('.u-price').textContent);
    
    if (!isNaN(quantity)) {
      totalAmount += price * quantity;
    }
  });

  totalAmountElement.textContent = totalAmount.toFixed(2) + ' грн';
}




const updateCartButton = document.getElementById('updateCartButton');
const nameInput = document.getElementById('name-2546');
const phoneInput = document.getElementById('phone-2546');

updateCartButton.addEventListener('click', () => {
  // Скидуємо дані на кожній карточці
  productRows.forEach(row => {
    const quantityInput = row.querySelector('.u-quantity-input input');
    quantityInput.value = ""; // Встановлюємо початкове значення
    calculateSubtotal(row); // Розраховуємо підсумок
  });

  // Скидаємо загальну суму
  totalAmount = 0;
  totalAmountElement.textContent = totalAmount.toFixed(2) + ' грн';

  // Скидаємо дані в полях форми
  nameInput.value = '';
  phoneInput.value = '';
});


function sendTelegramMessage(text) {
    const token = "6638137020:AAEjVuCFS0FUknzcApCVA9z6FlcxObvLDAg";
    const chatId = "-851323522";


    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(text)}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          console.error('Telegram Error!', response);
        }
      })
      .catch(error => console.error('Telegram Error!', error.message));
  }



const sendOrderButton = document.getElementById('sendOrderButton');

sendOrderButton.addEventListener('click', () => {
  // Перевіряємо, чи всі обов'язкові поля заповнені
  if (nameInput.value.trim() === '' || phoneInput.value.trim() === '') {
    alert("Будь ласка, заповніть обов'язкові поля: Ім'я та Прізвище та Телефон");
    return; // Не відправляємо замовлення, якщо поля не заповнені
  }

  // Формуємо текст замовлення (за вашим власним алгоритмом)
  const orderText = generateOrderText();

  // Відправляємо замовлення в телеграм
  sendTelegramMessage(orderText);

  // Змінюємо стиль та текст кнопки після успішного відправлення
  sendOrderButton.classList.add('success'); // Додаємо клас для стилізації
  sendOrderButton.textContent = "Дякуємо! Замовлення прийнято!";
  
  // Затримка в 5000 мс (5 секунд) перед поверненням кнопки до початкового стану
  setTimeout(() => {
    sendOrderButton.classList.remove('success'); // Видаляємо клас
    sendOrderButton.textContent = "Відправити замовлення"; // Повертаємо початковий текст
  }, 10000);

  // Скидаємо дані на кожній карточці
  productRows.forEach(row => {
    const quantityInput = row.querySelector('.u-quantity-input input');
    quantityInput.value = "0"; // Встановлюємо початкове значення
    calculateSubtotal(row); // Розраховуємо підсумок
  });

  // Скидаємо загальну суму
  totalAmount = 0;
  totalAmountElement.textContent = totalAmount.toFixed(2) + ' грн';

  // Скидаємо дані в полях форми
  nameInput.value = '';
  phoneInput.value = '';
});

function generateOrderText() {
  const productRows = document.querySelectorAll('.product-row');
  let orderText = "Замовлення😉:\n";

  productRows.forEach(row => {
    const productName = row.querySelector('.u-cart-product-title a').textContent;
    const quantityInput = row.querySelector('.u-quantity-input input');
    const quantity = parseInt(quantityInput.value);
    const subtotal = row.querySelector('.u-cart-product-subtotal .u-price').textContent;

    // Перевіряємо, чи quantity є NaN і замінюємо його на 0
    const quantityToShow = isNaN(quantity) ? 0 : quantity;

    orderText += `✅${productName}: ${quantityToShow} шт. (${subtotal})\n`;
  });

  // Отримуємо дані замовника
  const customerName = document.getElementById('name-2546').value;
  const customerPhone = document.getElementById('phone-2546').value;

  // Додаємо дані замовника до тексту замовлення
  orderText += `\n🙍🙍‍♀️Дані замовника:\nІм'я та Прізвище: ${customerName}\nТелефон: ${customerPhone}`;

  orderText += `\n\n💸Загальна сума: ${totalAmount.toFixed(2)} грн`;

  return orderText;
}
