import { Actor } from "@dfinity/agent";
import { idlFactory } from "../../declarations/dbank/dbank.did.js";
import { canisterId } from "../../declarations/dbank";
import { createAgent } from "./agent.js";

const agent = createAgent();
const dbank = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

let loadAttempts = 0;
const MAX_LOAD_ATTEMPTS = 3;

async function loadBalance() {
  try {
    const currentAmount = await dbank.checkBalance();
    document.getElementById("value").innerText = Math.round(currentAmount * 100) / 100;
    loadAttempts = 0; // Reset on success
  } catch (error) {
    loadAttempts++;
    console.error(`Load attempt ${loadAttempts} failed:`, error.message);

    // Only retry up to 3 times
    if (loadAttempts < MAX_LOAD_ATTEMPTS) {
      setTimeout(loadBalance, 2000);
    } else {
      console.error("Failed to load balance after multiple attempts");
      document.getElementById("value").innerText = "Error";
    }
  }
}

window.addEventListener("load", async function () {
  console.log("Finished loading");
  loadBalance();
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

    // Wait for state to update
    await new Promise(r => setTimeout(r, 1000));

    const currentAmount = await dbank.checkBalance();
    document.getElementById("value").innerText = Math.round(currentAmount * 100) / 100;

    document.getElementById("input-amount").value = "";
    document.getElementById("withdrawal-amount").value = "";

    alert("Transaction completed successfully!");
  } catch (error) {
    console.error("Transaction failed:", error);
    alert("Transaction failed: " + error.message);
  } finally {
    button.removeAttribute("disabled");
  }
});