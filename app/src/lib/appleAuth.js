// Sign in with Apple.
//
// Web: Supabase-OAuth-Redirect (funktioniert im Browser).
// Nativ (iOS/Capacitor): braucht das Plugin @capacitor-community/apple-sign-in
//   + konfigurierten Apple-Provider in Supabase. Solange das nicht eingerichtet
//   ist, wirft die Funktion bewusst mit Hinweis. Setup: docs/apple-signin-setup.md
//
// Zielflow nativ (nach Plugin-Install einkommentieren):
//   const { SignInWithApple } = await import('@capacitor-community/apple-sign-in')
//   const res = await SignInWithApple.authorize({
//     clientId: 'de.planumplants.app',
//     scopes: 'email name',
//   })
//   const idToken = res.response.identityToken
//   return supabase.auth.signInWithIdToken({ provider: 'apple', token: idToken })

import { Capacitor } from '@capacitor/core'
import { supabase } from './supabase.js'

export async function signInWithApple() {
  if (!Capacitor.isNativePlatform()) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${window.location.origin}/app/auth/callback` },
    })
    if (error) throw error
    return
  }
  throw new Error('Apple-Login wird noch eingerichtet – siehe docs/apple-signin-setup.md')
}
