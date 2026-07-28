const steps = document.querySelectorAll(".step");
const sidebarItems = document.querySelectorAll(".sidebar li");
let currentStep = 0;
let selectedPlan = null;
let selectedAddons = [];
let billingType = "monthly"; // default

const nxt = document.getElementById("next-button");
const back = document.getElementById("back-button");

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
    step.style.display = i === index ? "block" : "none";
  });
  sidebarItems.forEach((item, i) => item.classList.toggle("active", i === index));
  currentStep = index;

  back.style.display = index === 0 ? "none" : "inline-block";
  nxt.textContent = index === 3 ? "Confirm" : "Next step";
  if (index === 4) {
    nxt.style.display = "none";
    back.style.display = "none";
  } else {
    nxt.style.display = "inline-block";
  }
}

// Next button logic
nxt.addEventListener("click", () => {
  if (currentStep === 0) {
    const name = document.querySelector('input[name="userName"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();

    const nameError = document.querySelector(".name-error");
    const emailError = document.querySelector(".email-error");
    const phoneError = document.querySelector(".phone-error");

    let valid = true;
    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";

    if (!name) { nameError.textContent = "Enter your name"; valid = false; }
    if (!email) { emailError.textContent = "Enter email"; valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { emailError.textContent = "Invalid email format."; valid = false; }
    if (!phone) { phoneError.textContent = "Enter your mobile number"; valid = false; }

    if (valid) showStep(1);

  } else if (currentStep === 1) {
    const error = document.querySelector(".step-2 .error-message");
    if (!selectedPlan) {
      error.textContent = "Please select a plan";
      return;
    }
    error.textContent = "";
    showStep(2);

  } else if (currentStep === 2) {
    // Collect selected add-ons from checkboxes
    selectedAddons = [];
    document.querySelectorAll(".addon-checkbox:checked").forEach(cb => {
      selectedAddons.push(cb.value);
    });
    populateSummary();
    showStep(3);

  } else if (currentStep === 3) {
    showStep(4);
  }
});

// Back button logic
back.addEventListener("click", () => {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
});

// Plan selection
document.querySelectorAll(".plan_card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".plan_card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedPlan = card.textContent.trim();
  });
});

// Billing toggle
const billingSwitch = document.getElementById("billingSwitch");
billingSwitch.addEventListener("change", () => {
  billingType = billingSwitch.checked ? "yearly" : "monthly";
});

// Add-ons (checkbox selection toggles parent div class)
document.querySelectorAll(".addon-checkbox").forEach(cb => {
  cb.addEventListener("change", () => {
    const parent = cb.closest(".addon_card");
    if (cb.checked) {
      parent.classList.add("selected");
    } else {
      parent.classList.remove("selected");
    }
  });
});

// Summary
function populateSummary() {
  const summary = document.getElementById("summary");

  let planPrice = 0;
  if (selectedPlan) {
    const match = selectedPlan.match(/\$(\d+)/);
    if (match) planPrice = parseInt(match[1], 10);
  }

  let addonTotal = 0;
  selectedAddons.forEach(addon => {
    const match = addon.match(/\$(\d+)/);
    if (match) addonTotal += parseInt(match[1], 10);
  });

  let total = planPrice + addonTotal;
  if (billingType === "yearly") total *= 12;

  summary.innerHTML = `
    <div class="gbox"><p><strong>Plan:</strong> ${selectedPlan}</p>
    <p><strong>Add-ons:</strong> ${selectedAddons.join(", ") || "None"}</p></div>
    <p><strong>Total (${billingType}):</strong> $${total}/${billingType === "yearly" ? "yr" : "mo"}</p>
  `;
}

// Initialize
showStep(0);
