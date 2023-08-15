const quantityInputs = document.querySelectorAll('.quantity-input');

// Встановлюємо початкове значення для всіх полів вводу
quantityInputs.forEach(input => {
  input.value = "0";

  // Слідкуємо за змінами в полі вводу
  input.addEventListener('input', () => {
    const currentValue = parseInt(input.value);
    
    // Відновлюємо значення до 0, якщо введено від'ємне або нульове значення
    if (currentValue <= 0 || isNaN(currentValue)) {
      input.value = "0";
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
  const subtotal = price * quantity;

  subtotalElement.textContent = subtotal.toFixed(2) + ' грн';

  // Оновлюємо загальну суму
  totalAmount += subtotal;
  totalAmountElement.textContent = totalAmount.toFixed(2) + ' грн';
}

// Додаємо обробник події для кожної карточки товару
productRows.forEach(row => {
  const quantityInput = row.querySelector('.u-quantity-input input');
  quantityInput.addEventListener('input', () => {
    calculateSubtotal(row);
  });

  // Викликаємо функцію для першого розрахунку підсумку
  calculateSubtotal(row);
});

const updateCartButton = document.getElementById('updateCartButton');
const nameInput = document.getElementById('name-2546');
const phoneInput = document.getElementById('phone-2546');

updateCartButton.addEventListener('click', () => {
  // Скидуємо дані на кожній карточці
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

// Решта вашого коду залишається без змін

function generateOrderText() {
  const productRows = document.querySelectorAll('.product-row');
  let orderText = "Замовлення:\n";

  productRows.forEach(row => {
    const productName = row.querySelector('.u-cart-product-title a').textContent;
    const quantity = parseInt(row.querySelector('.u-quantity-input input').value);
    const subtotal = row.querySelector('.u-cart-product-subtotal .u-price').textContent;

    orderText += `${productName}: ${quantity} шт. (${subtotal})\n`;
  });

  // Отримуємо дані замовника
  const customerName = document.getElementById('name-2546').value;
  const customerPhone = document.getElementById('phone-2546').value;

  // Додаємо дані замовника до тексту замовлення
  orderText += `\nДані замовника:\nІм'я та Прізвище: ${customerName}\nТелефон: ${customerPhone}`;

  orderText += `\nЗагальна сума: ${totalAmount.toFixed(2)} грн`;

  return orderText;
}

