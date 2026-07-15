// app/src/lib/assessApi.js
// Client-Aufrufe an Edge Function assess-plant. Kein Secret, nur JWT via supabase-js.
import { supabase } from './supabase.js'

// image: File/Blob -> base64 ohne data:-prefix
export async function fileToBase64(file) {
  const buf = await file.arrayBuffer()
  let binary = ''
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

export async function assessNfc(imageBase64, plantId) {
  const { data, error } = await supabase.functions.invoke('assess-plant', {
    body: { mode: 'assess', image_base64: imageBase64, plant_id: plantId },
  })
  if (error) throw error
  return data
}

export async function assessSkip(imageBase64) {
  const { data, error } = await supabase.functions.invoke('assess-plant', {
    body: { mode: 'assess', image_base64: imageBase64 },
  })
  if (error) throw error
  return data
}

export async function confirmMatch(photoId, plantId) {
  const { data, error } = await supabase.functions.invoke('assess-plant', {
    body: { mode: 'confirm', photo_id: photoId, plant_id: plantId },
  })
  if (error) throw error
  return data
}
