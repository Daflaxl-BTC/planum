// Native Push-Registrierung (nur iOS/Capacitor). Im Web-Build No-Op.
//
// Flow:
//   1. Berechtigung anfragen (iOS-System-Dialog).
//   2. Bei Erteilung: APNs-Device-Token via 'registration'-Event erhalten.
//   3. Token an die Edge Function push-register schicken (schreibt server-
//      seitig via service-role in push_tokens — der Client hat keine
//      Insert-Policy).
//
// Aufruf nach erfolgreichem Login (siehe AuthContext).

import { Capacitor } from '@capacitor/core'
import { supabase } from './supabase.js'

let initialized = false

export async function initPushNotifications() {
  if (initialized) return
  if (!Capacitor.isNativePlatform()) return
  initialized = true

  const { PushNotifications } = await import('@capacitor/push-notifications')

  PushNotifications.addListener('registration', async (tokenData) => {
    try {
      await supabase.functions.invoke('push-register', {
        body: { token: tokenData.value, platform: 'ios' },
      })
    } catch (err) {
      console.error('push-register failed', err)
    }
  })

  PushNotifications.addListener('registrationError', (err) => {
    console.error('push registration error', err)
  })

  const perm = await PushNotifications.checkPermissions()
  let receive = perm.receive
  if (receive === 'prompt' || receive === 'prompt-with-rationale') {
    receive = (await PushNotifications.requestPermissions()).receive
  }
  if (receive !== 'granted') return

  await PushNotifications.register()
}
