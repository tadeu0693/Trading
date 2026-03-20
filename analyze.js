export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5-20251101',
        max_tokens: 1024,
        system: `Você é um assistente especialista em trading e análise de mercados financeiros brasileiros.
Você recebe capturas de tela do app da corretora do usuário e deve:
1. Analisar gráficos de candlestick, linha e área
2. Identificar tendências (alta, baixa, lateral)
3. Apontar suportes e resistências visíveis
4. Reconhecer padrões técnicos relevantes
5. Comentar indicadores visíveis (RSI, MACD, médias móveis, Bollinger, etc.)
6. Dar sinal claro: COMPRA 🟢 / VENDA 🔴 / NEUTRO 🟡 com justificativa
7. Mencionar nível de confiança da análise
Seja direto, objetivo, use linguagem de trader brasileiro.
Formate com emojis para facilitar leitura no celular.
SEMPRE finalize com: "⚠️ Análise educacional, não é recomendação de investimento."`,
        messages: body.messages,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
