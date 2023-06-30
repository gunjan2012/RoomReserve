
export function convertFirebaseErrorMessage(errorMessage:string) {
    let customErrorMessage = "";
  
    // Check for specific Firebase error messages and map them to custom error messages
    switch (errorMessage) {
      case "Firebase: Error (auth/user-not-found).":
        customErrorMessage = "User not found. Please check your credentials.";
        break;
      case "Firebase: Error (auth/invalid-email).":
        customErrorMessage = "Invalid email address. Please provide a valid email.";
        break;
      case "Firebase: Error (auth/wrong-password).":
        customErrorMessage = "Incorrect password. Please try again.";
        break;
      case "Firebase: Error (auth/email-already-in-use).":
        customErrorMessage = "User already exists. Please try with another email.";
        break;
      // If the error message doesn't match any specific cases, use a generic error message
      default:
        customErrorMessage = "An error occurred. Please try again later.";
        break;
    }
  
    return customErrorMessage;
  }
  