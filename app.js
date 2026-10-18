/**
 * CubeFactory Authentication Forms Logic
 * Handles Form Validation & DummyJSON Login API
 */

document.addEventListener('DOMContentLoaded', () => {
  const signinForm = document.getElementById('signin-form');
  const signupForm = document.getElementById('signup-form');

  // Attach submit handlers
  if (signinForm) {
    signinForm.addEventListener('submit', handleLogin);
  }

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignUp);
  }

  // Real-time input validation listeners
  setupLiveValidation();
});

// ============================================================================
// 1. Core handleLogin Function (DummyJSON API)
// ============================================================================
function handleLogin(event) {
  // Prevent the default browser page reload
  event.preventDefault();

  console.log("-----------------------------------------");
  console.log("🔵 Form submitted: Executing handleLogin()...");

  // Get input elements and their values
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value;

  console.log("Email entered:", emailValue);
  console.log("Password entered:", passwordValue);

  // Validate fields before sending request
  const isEmailValid = validateEmailField(emailInput);
  const isPasswordValid = validatePasswordField(passwordInput);

  if (!isEmailValid || !isPasswordValid) {
    console.warn("⚠️ Validation failed: Please fix the errors highlighted in red.");
    return;
  }

  console.log("✅ Validation passed! Sending request to DummyJSON API...");

  // Update button UI while loading
  const submitBtn = document.getElementById('signin-submit-btn');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in...";

  // DummyJSON Login Endpoint
  const apiUrl = "https://dummyjson.com/auth/login";

  // Extract username from email
  const username = emailValue.includes('@') ? emailValue.split('@')[0] : emailValue;

  const payload = {
    username: username,
    password: passwordValue
  };

  console.log("Payload being sent:", payload);

  // Fetch API with Promises (.then / .catch)
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then((response) => {
      console.log("🌐 Raw HTTP Response:", response);
      console.log("Response Status Code:", response.status);

      // Check if network request failed completely
      if (!response.ok && response.status !== 400) {
        throw new Error(`Server returned status code: ${response.status}`);
      }

      // Parse JSON payload
      return response.json();
    })
    .then((data) => {
      console.log(`📦 Parsed API Response for [${payload.username}]:`, data);

      if (data.message === "Invalid credentials") {
        console.log(`👤 User: ${payload.username}`);
        console.log(`📧 Email: ${emailValue}`);
        console.log(`🔒 Status: Credentials received by API. (DummyJSON simulated response: ${data.message})`);
        alert(`Login processed for ${payload.username}!\nAPI Status: ${data.message}`);
      } else {
        const displayName = data.firstName ? `${data.firstName} ${data.lastName}` : payload.username;
        console.log(`🎉 Welcome back, ${displayName}!`);
        console.log("User ID:", data.id);
        console.log("Access Token:", data.accessToken);
        alert(`Welcome back, ${displayName}! Login successful.`);
      }
    })
    .catch((error) => {
      console.error("🔴 Network/Fetch Error for " + payload.username + ":", error);
      alert("Network Error, please check your internet connection.");
    })
    .finally(() => {
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      console.log(`🏁 handleLogin() finished for user: ${payload.username}`);
      console.log("-----------------------------------------");
    });
}

// ============================================================================
// 2. Sign Up Handler (DummyJSON Users API)
// ============================================================================
function handleSignUp(event) {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const isNameValid = nameInput.value.trim().length >= 2;
  const isEmailValid = validateEmailField(emailInput);
  const isPasswordValid = validatePasswordField(passwordInput);

  if (!isNameValid || !isEmailValid || !isPasswordValid) {
    console.warn("⚠️ Sign-up validation failed.");
    return;
  }

  const submitBtn = document.getElementById('signup-submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating account...";

  const apiUrl = "https://dummyjson.com/users/add";
  const payload = {
    firstName: nameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value
  };

  console.log("🔵 Sending Sign Up payload to DummyJSON:", payload);

  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("🎉 User created on DummyJSON:", data);
      alert(`Account created successfully for ${data.firstName}! (Check Console)`);
      document.getElementById('signup-form').reset();
    })
    .catch((err) => {
      console.error("🔴 Sign-up Error:", err);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Create account";
    });
}

// ============================================================================
// 3. Validation Helpers & Error Toggling
// ============================================================================
function validateEmailField(input) {
  const group = document.getElementById('email-group');
  const errorMsg = document.getElementById('email-error');
  const value = input.value.trim();

  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value || !emailRegex.test(value)) {
    group.classList.add('has-error');
    errorMsg.textContent = "Please enter a valid email address";
    return false;
  }

  group.classList.remove('has-error');
  return true;
}

function validatePasswordField(input) {
  const group = document.getElementById('password-group');
  const errorMsg = document.getElementById('password-error');
  const value = input.value;

  // Rule from screenshot: "Your password must contain only numbers"
  const isOnlyNumbers = /^\d+$/.test(value);

  if (!value || !isOnlyNumbers) {
    group.classList.add('has-error');
    errorMsg.textContent = "Your password must contain only numbers";
    return false;
  }

  group.classList.remove('has-error');
  return true;
}

// ============================================================================
// 4. Live Validation on input & blur
// ============================================================================
function setupLiveValidation() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (emailInput) {
    emailInput.addEventListener('blur', () => validateEmailField(emailInput));
    emailInput.addEventListener('input', () => {
      const group = document.getElementById('email-group');
      if (group && group.classList.contains('has-error')) {
        validateEmailField(emailInput);
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('blur', () => validatePasswordField(passwordInput));
    passwordInput.addEventListener('input', () => {
      const group = document.getElementById('password-group');
      if (group && group.classList.contains('has-error')) {
        validatePasswordField(passwordInput);
      }
    });
  }
}