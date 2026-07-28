const steps = document.querySelectorAll(".step");
const sidebarItems = document.querySelectorAll(".sidebar li");
let currentStep = 0;
let selectedPlan = null;
let selectedAddons = [];
let billingType = "monthly"; // default

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
    step.style.display = i === index ? "block" : "none";
  });
  sidebarItems.forEach((item, i) => item.classList.toggle("active", i === index));
  currentStep = index;
}

// Handle all Next buttons
document.querySelectorAll("#next-button").forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep === 0) {
      // Step 1 validation
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
      // Step 2 plan validation
      const error = document.querySelector(".step-2 .error-message");
      if (!selectedPlan) {
        error.textContent = "Please select a plan";
        return;
      }
      error.textContent = "";
      showStep(2);

    } else if (currentStep === 2) {
      // Step 3 → Summary
      populateSummary();
      showStep(3);

    } else if (currentStep === 3) {
      // Step 4 → Thank You
      showStep(4);
    }
  });
});

// Back buttons remain the same
document.getElementById("back-plan").addEventListener("click", () => showStep(0));
document.getElementById("back-addon").addEventListener("click", () => showStep(1));
document.getElementById("back-summary").addEventListener("click", () => showStep(2));

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

// Add-ons
document.querySelectorAll(".addon_card").forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("selected");
    if (card.classList.contains("selected")) {
      selectedAddons.push(card.textContent.trim());
    } else {
      selectedAddons = selectedAddons.filter(a => a !== card.textContent.trim());
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
