<script setup>
import { ref, reactive } from "vue";

// Form state
const formData = reactive({
  accountHolderName: "",
  accountNumber: "",
  bankName: "",
  branchName: "",
  ifscCode: "",
  accountType: "savings",
  isPrimary: false,
});

// Validation state
const errors = reactive({
  accountHolderName: "",
  accountNumber: "",
  bankName: "",
  ifscCode: "",
});

// Submit status
const isSubmitting = ref(false);
const submitSuccess = ref(false);

// Validation functions
const validateAccountHolderName = () => {
  if (!formData.accountHolderName.trim()) {
    errors.accountHolderName = "Account holder name is required";
    return false;
  }
  errors.accountHolderName = "";
  return true;
};

const validateAccountNumber = () => {
  if (!formData.accountNumber.trim()) {
    errors.accountNumber = "Account number is required";
    return false;
  }
  if (!/^\d{9,18}$/.test(formData.accountNumber)) {
    errors.accountNumber = "Account number must be 9-18 digits";
    return false;
  }
  errors.accountNumber = "";
  return true;
};

const validateBankName = () => {
  if (!formData.bankName.trim()) {
    errors.bankName = "Bank name is required";
    return false;
  }
  errors.bankName = "";
  return true;
};

const validateIfscCode = () => {
  if (!formData.ifscCode.trim()) {
    errors.ifscCode = "IFSC code is required";
    return false;
  }
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
    errors.ifscCode = "Invalid IFSC code format";
    return false;
  }
  errors.ifscCode = "";
  return true;
};

// Submit handler
const handleSubmit = async () => {
  // Validate all fields
  const isNameValid = validateAccountHolderName();
  const isAccountValid = validateAccountNumber();
  const isBankValid = validateBankName();
  const isIfscValid = validateIfscCode();

  if (!isNameValid || !isAccountValid || !isBankValid || !isIfscValid) {
    return;
  }

  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Here you would typically send the data to your backend
    console.log("Submitting bank details:", formData);

    submitSuccess.value = true;

    // Reset form after successful submission
    setTimeout(() => {
      Object.assign(formData, {
        accountHolderName: "",
        accountNumber: "",
        bankName: "",
        branchName: "",
        ifscCode: "",
        accountType: "savings",
        isPrimary: false,
      });
      submitSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error("Error submitting bank details:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form
const resetForm = () => {
  Object.assign(formData, {
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
    accountType: "savings",
    isPrimary: false,
  });

  // Clear errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
};
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary/15 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-primary/35 rounded-2xl shadow-sm mb-4"
        >
          <svg
            class="w-8 h-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            ></path>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Add Bank Account Details
        </h2>
        <p class="text-gray-600">
          Please provide your bank account information for vendor payments
        </p>
      </div>

      <!-- Success Message -->
      <div
        v-if="submitSuccess"
        class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm flex items-center space-x-3 animate-fade-in"
      >
        <div
          class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <p class="text-green-800 font-medium">
          Bank account details submitted successfully!
        </p>
      </div>

      <!-- Form -->
      <div
        class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Account Holder Name -->
            <div>
              <label
                for="accountHolderName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Account Holder Name <span class="text-red-500">*</span>
              </label>
              <input
                id="accountHolderName"
                v-model="formData.accountHolderName"
                type="text"
                placeholder="Enter account holder's name"
                :class="[
                  errors.accountHolderName
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                ]"
                class="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-colors duration-200"
                @blur="validateAccountHolderName"
              />
              <p
                v-if="errors.accountHolderName"
                class="mt-2 text-sm text-red-600 flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {{ errors.accountHolderName }}
              </p>
            </div>

            <!-- Account Number -->
            <div>
              <label
                for="accountNumber"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Account Number <span class="text-red-500">*</span>
              </label>
              <input
                id="accountNumber"
                v-model="formData.accountNumber"
                type="text"
                placeholder="Enter account number"
                :class="[
                  errors.accountNumber
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                ]"
                class="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-colors duration-200"
                @blur="validateAccountNumber"
                @input="
                  formData.accountNumber = formData.accountNumber.replace(
                    /\D/g,
                    ''
                  )
                "
              />
              <p
                v-if="errors.accountNumber"
                class="mt-2 text-sm text-red-600 flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {{ errors.accountNumber }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Bank Name -->
            <div>
              <label
                for="bankName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Bank Name <span class="text-red-500">*</span>
              </label>
              <input
                id="bankName"
                v-model="formData.bankName"
                type="text"
                placeholder="Enter bank name"
                :class="[
                  errors.bankName
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                ]"
                class="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-colors duration-200"
                @blur="validateBankName"
              />
              <p
                v-if="errors.bankName"
                class="mt-2 text-sm text-red-600 flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {{ errors.bankName }}
              </p>
            </div>

            <!-- Branch Name -->
            <div>
              <label
                for="branchName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Branch Name
              </label>
              <input
                id="branchName"
                v-model="formData.branchName"
                type="text"
                placeholder="Enter branch name"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- IFSC Code -->
            <div>
              <label
                for="ifscCode"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                IFSC Code <span class="text-red-500">*</span>
              </label>
              <input
                id="ifscCode"
                v-model="formData.ifscCode"
                type="text"
                placeholder="Enter IFSC code"
                :class="[
                  errors.ifscCode
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
                ]"
                class="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-colors duration-200 uppercase"
                @blur="validateIfscCode"
                @input="formData.ifscCode = formData.ifscCode.toUpperCase()"
              />
              <p
                v-if="errors.ifscCode"
                class="mt-2 text-sm text-red-600 flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                {{ errors.ifscCode }}
              </p>
            </div>

            <!-- Account Type -->
            <div>
              <label
                for="accountType"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Account Type <span class="text-red-500">*</span>
              </label>
              <select
                id="accountType"
                v-model="formData.accountType"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
              >
                <option value="savings">Savings Account</option>
                <option value="current">Current Account</option>
                <option value="salary">Salary Account</option>
              </select>
            </div>
          </div>

          <!-- Primary Account Checkbox -->
          <div class="flex items-center">
            <div class="flex items-center h-5">
              <input
                id="isPrimary"
                v-model="formData.isPrimary"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="isPrimary" class="font-medium text-gray-700"
                >Set as primary account for payments</label
              >
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              @click="resetForm"
              :disabled="isSubmitting"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200 font-medium shadow-sm"
            >
              Reset
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-6 py-3 border border-transparent rounded-lg text-white bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 font-medium shadow-sm"
            >
              <span
                v-if="isSubmitting"
                class="flex items-center justify-center"
              >
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
              <span v-else>Save Bank Details</span>
            </button>
          </div>
        </form>

        <!-- Help Text -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h4
            class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3"
          >
            Information
          </h4>
          <ul class="space-y-2 text-sm text-gray-600">
            <li class="flex items-start">
              <svg
                class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              All fields marked with
              <span class="text-red-500 ml-1">*</span> are mandatory
            </li>
            <li class="flex items-start">
              <svg
                class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Account number should be 9-18 digits only
            </li>
            <li class="flex items-start">
              <svg
                class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              IFSC code format: ABCD0123456 (4 letters, 0, 6 digits/letters)
            </li>
            <li class="flex items-start">
              <svg
                class="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Payments will be processed to your primary account
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
