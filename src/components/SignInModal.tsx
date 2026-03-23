import { useState } from 'react';
import { MapPin, X, User, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

/** Decode a JWT payload without verifying the signature (client-side only). */
function decodeJwtPayload(token: string): Record<string, unknown> {
  const part = token.split('.')[1];
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

interface GuestFormState {
  name: string;
  email: string;
  phone: string;
}

export default function SignInModal() {
  const { showSignInModal, setShowSignInModal, signInAsGuest, signInWithOAuth } = useApp();
  const [notice, setNotice] = useState<{ type: 'error' | 'info'; message: string } | null>(null);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestForm, setGuestForm] = useState<GuestFormState>({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null);

  if (!showSignInModal) return null;

  const showError = (message: string) => {
    setNotice({ type: 'error', message });
    setTimeout(() => setNotice(null), 6000);
  };

  const showInfo = (message: string) => {
    setNotice({ type: 'info', message });
    setTimeout(() => setNotice(null), 8000);
  };

  const handleGoogleSignIn = () => {
    if (!GOOGLE_CLIENT_ID) {
      showInfo(
        'Google Sign-In needs a Client ID. Set VITE_GOOGLE_CLIENT_ID in your .env file — see .env.example for instructions.'
      );
      return;
    }

    if (!window.google?.accounts?.id) {
      showError('Google Sign-In library failed to load. Check your network and try again.');
      return;
    }

    setLoading('google');

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      cancel_on_tap_outside: true,
      callback: (response) => {
        setLoading(null);
        try {
          const payload = decodeJwtPayload(response.credential);
          signInWithOAuth({
            name: (payload.name as string) || 'Google User',
            email: (payload.email as string) || '',
            avatar: payload.picture as string | undefined,
            phone: '',
            authProvider: 'google',
            savedListings: [],
            contactPreferences: { email: true, phone: false, text: false },
          });
        } catch {
          showError('Failed to read Google account info. Please try again.');
        }
      },
    });

    window.google.accounts.id.prompt((notification) => {
      if (
        notification.isNotDisplayed() ||
        notification.isSkippedMoment() ||
        notification.isDismissedMoment()
      ) {
        setLoading(null);
        const reason = notification.isNotDisplayed()
          ? notification.getNotDisplayedReason()
          : notification.isSkippedMoment()
          ? notification.getSkippedReason()
          : notification.getDismissedReason();
        // 'credential_returned' means success already handled by callback — ignore
        if (reason !== 'credential_returned') {
          // Prompt was suppressed (e.g. user previously dismissed One Tap)
          // Fall back to a redirect-style popup via renderButton pattern,
          // or just inform the user.
          if (reason === 'suppressed_by_user') {
            showInfo(
              'Google One Tap was suppressed. Clear your browser cookies for this site, or try again later.'
            );
          }
        }
      }
    });
  };

  const handleAppleSignIn = async () => {
    if (!APPLE_CLIENT_ID) {
      showInfo(
        'Apple Sign-In needs a Services ID. Set VITE_APPLE_CLIENT_ID in your .env file — see .env.example for instructions.'
      );
      return;
    }

    if (!window.AppleID) {
      showError('Apple Sign-In library failed to load. Check your network and try again.');
      return;
    }

    setLoading('apple');

    try {
      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: window.location.origin,
        usePopup: true,
      });

      const response = await window.AppleID.auth.signIn();

      const firstName = response.user?.name?.firstName || '';
      const lastName = response.user?.name?.lastName || '';
      const fullName = [firstName, lastName].filter(Boolean).join(' ');

      signInWithOAuth({
        name: fullName || 'Apple User',
        email: response.user?.email || '',
        phone: '',
        authProvider: 'apple',
        savedListings: [],
        contactPreferences: { email: true, phone: false, text: false },
      });
    } catch (err: unknown) {
      setLoading(null);
      // User closed the popup — not an error
      if (
        err &&
        typeof err === 'object' &&
        'error' in err &&
        (err as { error: string }).error === 'popup_closed_by_user'
      ) {
        return;
      }
      showError('Apple Sign-In failed. Please try again or use another method.');
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signInAsGuest(guestForm.name, guestForm.email, guestForm.phone);
  };

  const handleSkip = () => {
    setShowSignInModal(false);
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSkip} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-blue-600">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">RealtyMap Pro</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to save listings and personalize your experience
          </p>
        </div>

        <div className="px-6 pb-6 space-y-3">
          {/* Notice banner */}
          {notice && (
            <div
              className={`flex items-start gap-2 p-3 rounded-xl text-sm border ${
                notice.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <AlertCircle
                className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  notice.type === 'error' ? 'text-red-500' : 'text-amber-500'
                }`}
              />
              <span>{notice.message}</span>
            </div>
          )}

          {!showGuestForm ? (
            <>
              {/* Google button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading === 'google' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </button>

              {/* Apple button */}
              <button
                onClick={handleAppleSignIn}
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black border border-black rounded-xl text-sm font-medium text-white hover:bg-gray-900 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading === 'apple' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <AppleIcon />
                )}
                Continue with Apple
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Guest option */}
              <button
                onClick={() => setShowGuestForm(true)}
                disabled={loading !== null}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <User className="h-4 w-4" />
                Continue as Guest
              </button>

              <p className="text-center text-xs text-gray-400 pt-1">
                By continuing, you agree to our{' '}
                <span className="text-blue-500 cursor-pointer hover:underline">Terms</span> and{' '}
                <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </>
          ) : (
            /* Guest form */
            <>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setShowGuestForm(false)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  ← Back
                </button>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 leading-relaxed">
                <strong>Guest Mode:</strong> Your information will not be saved across sessions.
                It will only be used to pre-fill contact forms during this visit.
              </div>

              <form onSubmit={handleGuestSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={guestForm.name}
                    onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                    placeholder="Your full name"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Email <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    required
                    value={guestForm.email}
                    onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                    placeholder="you@example.com"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Phone <span className="text-gray-400">(optional)</span></label>
                  <input
                    type="tel"
                    value={guestForm.phone}
                    onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                    placeholder="(512) 555-0100"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Continue as Guest
                </button>
              </form>
            </>
          )}

          {/* Skip entirely */}
          <button
            onClick={handleSkip}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
