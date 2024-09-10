async function fetchUserLocation() {
  try {
    const res = await fetch("https://ipinfo.io/json?token=f392ed94c6fb89");
    if (!res.ok) {
      throw new Error("Ошибка сети");
    }
    const locationData = await res.json();
    console.log("IP:", locationData.ip);
    console.log("Страна:", locationData.country);
    return locationData.country;
  } catch (err) {
    console.error("Ошибка при получении IP:", err);
    return "us";
  }
}

fetchUserLocation().then((userCountryCode) => {
  const contactForms = document.querySelectorAll('form[name="contactform"]');

  contactForms.forEach((form) => {
    hideIfRegistered(form);
    const phoneField = form.querySelector('input[name="phone"]');

    const phoneInput = window.intlTelInput(phoneField, {
      separateDialCode: true,
      preferredCountries: ["ca", "gb", "fr", "ua", "us"],
      initialCountry: userCountryCode.toLowerCase(),
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      // logTrackingEvents();

      const formData = {
        firstName: form.querySelector('[name="first_name"]').value.trim(),
        lastName: form.querySelector('[name="last_name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        phone: phoneInput.getNumber(),
        serviceTime: form.querySelector('[name="select_service"]').value.trim(),
        price: form.querySelector('[name="select_price"]').value.trim(),
        country: userCountryCode,
        comments: form.querySelector('[name="comments"]')?.value.trim() || "",
      };

      const validationErrors = validateForm(formData, form, phoneInput);
      if (validationErrors.length) {
        displayErrors(validationErrors);
        return;
      }

      try {
        const response = await fetch("actionFormAndDB.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (result.success == true) {
          showSuccessModal(result);
          setCookie("registration", "success", 30);
          hideIfRegistered(form);
           window.location.href = result.redirect_url;
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error("Ошибка при отправке формы:", err);
        alert("Не удается подключиться к серверу. Попробуйте снова.");
      }
    });
  });
});

function validateForm(data, form, phoneInput) {
  const errors = [];
  const firstName = form.querySelector('[name="first_name"]');
  const lastName = form.querySelector('[name="last_name"]');
  const email = form.querySelector('[name="email"]');
  const phone = form.querySelector('[name="phone"]');
  const timeSelector = form.querySelector('[name="select_service"]');
  const priceSelector = form.querySelector('[name="select_price"]');

  if (!data.firstName) {
    firstName.classList.add("inputRequired");
    errors.push("Имя обязательно.");
  }
  if (!data.lastName) {
    lastName.classList.add("inputRequired");
    errors.push("Фамилия обязательна.");
  }
  if (!data.email) {
    email.classList.add("inputRequired");
    errors.push("Email обязателен.");
  }
  if (!window.intlTelInputUtils.isValidNumber(phoneInput.getNumber())) {
    phone.classList.add("inputRequired");
    errors.push("Некорректный номер телефона.");
  }
  if (data.serviceTime === "selecttime") {
    timeSelector.classList.add("inputRequired");
    errors.push("Выберите время.");
  }
  if (!data.price) {
    priceSelector.classList.add("inputRequired");
    errors.push("Выберите цену.");
  }

  return errors;
}

function displayErrors(errors) {
  const errorMessage = errors.join("\n");
  console.log("Ошибки при отправке формы:", errorMessage);
  alert(`Найдены ошибки: \n${errorMessage}`);
}

function showSuccessModal(data) {
  alert(`Регистрация успешна! Ответ: ${data.message}`);
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function hideIfRegistered(form) {
  const isRegistered = getCookie("registration") === "success";
  if (isRegistered) {
    window.location.href = "Thanks.html"
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}
