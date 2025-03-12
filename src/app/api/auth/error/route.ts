import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');

  // Log the error for debugging purposes
  console.error('NextAuth error:', error);

  // Return a structured error response
  return NextResponse.json(
    {
      error: error || 'Unknown authentication error',
      status: 'error',
      message: getErrorMessage(error)
    },
    { status: 401 }
  );
}

// Helper function to get a user-friendly error message
function getErrorMessage(errorCode: string | null): string {
  switch (errorCode) {
    case 'AccessDenied':
      return 'You do not have permission to access this resource.';
    case 'Verification':
      return 'The verification link has expired or has already been used.';
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'OAuthCreateAccount':
    case 'EmailCreateAccount':
    case 'Callback':
    case 'OAuthAccountNotLinked':
    case 'EmailSignin':
    case 'CredentialsSignin':
      return 'There was a problem with your authentication.';
    case 'SessionRequired':
      return 'You must be signed in to access this resource.';
    default:
      return 'An authentication error occurred. Please try again.';
  }
}
