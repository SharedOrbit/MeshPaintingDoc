const DEFAULT_ALLOWED_ORIGIN = 'https://sharedorbit.github.io'

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}

function getCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || ''
  const allowedOrigins = (env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  const allowOrigin = allowedOrigins.includes('*') || allowedOrigins.includes(origin)
    ? origin || DEFAULT_ALLOWED_ORIGIN
    : DEFAULT_ALLOWED_ORIGIN

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  }
}

function readText(value, maxLength) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().slice(0, maxLength)
}

function createDiscordPayload(payload) {
  const fields = [
    { name: 'Feature', value: payload.feature, inline: true },
    { name: 'Importance', value: payload.importance, inline: true },
    { name: 'Page', value: payload.page || 'Unknown', inline: false }
  ]

  if (payload.contact) {
    fields.push({ name: 'Contact', value: payload.contact, inline: false })
  }

  return {
    username: 'Mesh Painting Docs',
    embeds: [
      {
        title: 'New Roadmap Feedback',
        description: payload.message,
        color: 0x47a8ff,
        fields,
        timestamp: new Date().toISOString()
      }
    ]
  }
}

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request, env)

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      })
    }

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405, corsHeaders)
    }

    if (!env.DISCORD_WEBHOOK_URL) {
      return json({ ok: false, error: 'Discord webhook is not configured' }, 500, corsHeaders)
    }

    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > 8192) {
      return json({ ok: false, error: 'Payload too large' }, 413, corsHeaders)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ ok: false, error: 'Invalid JSON' }, 400, corsHeaders)
    }

    const payload = {
      feature: readText(body.feature, 120),
      importance: readText(body.importance, 40),
      message: readText(body.message, 1500),
      contact: readText(body.contact, 120),
      page: readText(body.page, 300)
    }

    if (!payload.feature || !payload.importance || payload.message.length < 3) {
      return json({ ok: false, error: 'Missing feedback data' }, 400, corsHeaders)
    }

    const discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(createDiscordPayload(payload))
    })

    if (!discordResponse.ok) {
      return json({ ok: false, error: 'Discord delivery failed' }, 502, corsHeaders)
    }

    return json({ ok: true }, 200, corsHeaders)
  }
}
