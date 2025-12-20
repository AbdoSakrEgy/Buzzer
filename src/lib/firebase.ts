import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUtigaGuWRMXj5SI1L8vLKI36GQAtX488",
  authDomain: "buzzer-4cd5a.firebaseapp.com",
  projectId: "buzzer-4cd5a",
  storageBucket: "buzzer-4cd5a.firebasestorage.app",
  messagingSenderId: "124693892804",
  appId: "1:124693892804:web:30ae5d76ae61e1ad020391",
};

// Initialize Firebase (prevent re-initialization in development)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Declare global type for recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
    confirmationResult: ConfirmationResult | undefined;
  }
}

/**
 * Initialize invisible reCAPTCHA verifier
 * @param buttonId - The ID of the button to attach the reCAPTCHA to
 */
export function initRecaptcha(buttonId: string): RecaptchaVerifier {
  // Clear existing verifier if any
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved - will proceed with submit
      console.log("reCAPTCHA verified");
    },
    "expired-callback": () => {
      // Reset reCAPTCHA
      console.log("reCAPTCHA expired");
    },
  });

  return window.recaptchaVerifier;
}

/**
 * Send OTP to phone number
 * @param phoneNumber - Phone number with country code (e.g., +201234567890)
 */
export async function sendOTP(
  phoneNumber: string
): Promise<ConfirmationResult> {
  if (!window.recaptchaVerifier) {
    throw new Error("reCAPTCHA not initialized. Call initRecaptcha first.");
  }

  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    window.recaptchaVerifier
  );
  window.confirmationResult = confirmationResult;

  return confirmationResult;
}

/**
 * Verify OTP code
 * @param otpCode - 6-digit OTP code entered by user
 */
export async function verifyOTP(otpCode: string): Promise<boolean> {
  if (!window.confirmationResult) {
    throw new Error("No OTP was sent. Please request OTP first.");
  }

  try {
    await window.confirmationResult.confirm(otpCode);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format phone number to E.164 format
 * @param phone - Phone number (may or may not have country code)
 * @param countryCode - Default country code (default: +20 for Egypt)
 */
export function formatPhoneNumber(
  phone: string,
  countryCode: string = "+20"
): string {
  // Remove spaces and dashes
  let cleaned = phone.replace(/[\s-]/g, "");

  // If already has +, return as is
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  // If starts with 0, remove it
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  return `${countryCode}${cleaned}`;
}

export { auth };
