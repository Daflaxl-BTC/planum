import { supabase } from './supabase.js'

export const SHOP_CATEGORIES = [
  { key: 'all',           label: 'Alle' },
  { key: 'duenger',       label: 'Dünger' },
  { key: 'erde',          label: 'Erde' },
  { key: 'toepfe',        label: 'Töpfe' },
  { key: 'bewaesserung',  label: 'Bewässerung' },
  { key: 'werkzeug',      label: 'Werkzeug' },
  { key: 'sonstiges',     label: 'Sonstiges' },
]

export async function fetchShopProducts(category = 'all') {
  let query = supabase
    .from('shop_products')
    .select('id, category, title, subtitle, description, image_url, affiliate_url, affiliate_network, price_hint, badge, sort_order')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}
