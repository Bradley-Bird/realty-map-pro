// Google Identity Services (GIS) globals
interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: GoogleIdConfig) => void;
        prompt: (notification?: (n: GooglePromptNotification) => void) => void;
        renderButton: (parent: HTMLElement, options: object) => void;
        disableAutoSelect: () => void;
        revoke: (hint: string, done: () => void) => void;
        cancel: () => void;
      };
    };
  };
  // Apple Sign In with Apple JS
  AppleID?: {
    auth: {
      init: (config: AppleAuthConfig) => void;
      signIn: () => Promise<AppleSignInResponse>;
    };
  };
}

interface GoogleIdConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: string;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GooglePromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  getDismissedReason: () => string;
}

interface AppleAuthConfig {
  clientId: string;
  scope: string;
  redirectURI: string;
  state?: string;
  nonce?: string;
  usePopup?: boolean;
}

interface AppleSignInResponse {
  authorization: {
    code: string;
    id_token: string;
    state?: string;
  };
  user?: {
    email: string;
    name?: {
      firstName: string;
      lastName: string;
    };
  };
}
