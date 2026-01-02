import { dbank } from "../../declarations/dbank";

window.addEventListener("load", async function () {
  console.log("Finished loading");
  try {
    const currentAmount = await dbank.checkBalance();
    document.getElementById("value").innerText = Math.round(currentAmount * 100) / 100;
  } catch (error) {
    console.error("Error checking balance:", error);
    // In development with local replica, signature errors are expected
    // Retry after a short delay to allow replica to settle
    if (error.message && error.message.includes("malformed signature")) {
      setTimeout(() => location.reload(), 2000);
    }
  }
});

document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const button = event.target.querySelector("#submit-button");

  const inputAmount = parseFloat(document.getElementById("input-amount").value);
  const withdrawAmount = parseFloat(document.getElementById("withdrawal-amount").value);

  button.setAttribute("disabled", true);

  try {
    if (inputAmount > 0) {
      await dbank.topUp(inputAmount);
    }

    if (withdrawAmount > 0) {
      await dbank.withdraw(withdrawAmount);
    }

    const currentAmount = await dbank.checkBalance();
    document.getElementById("value").innerText = Math.round(currentAmount * 100) / 100;

    document.getElementById("input-amount").value = "";
    document.getElementById("withdrawal-amount").value = "";
  } catch (error) {
    console.error("Error processing transaction:", error);
    alert("Transaction failed. Please try again.");
  } finally {
    button.removeAttribute("disabled");
  }
});