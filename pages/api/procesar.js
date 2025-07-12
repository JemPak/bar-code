const catalog = {
  5: "Chicles",
  8: "Refresco",
  11: "Pan Integral",
  12: "Galletas",
  15: "Leche",
  19: "Harina",
  20: "Azúcar",
  22: "Jabón",
  25: "Aceite",
  28: "Sal",
  35: "Cereal",
  45: "Café",
  51: "Yogur",
  60: "Pasta",
  75: "Arroz",
  90: "Pollo",
  229: "Carne de Res",
  1029: "Huevos",
  2744: "Mermelada"
};

function processBarcodes(barcodes) {
  const invoice = {};
  const errors = [];

  for (const code of barcodes) {
    if (!code.startsWith('|') || !code.endsWith('|')) {
      errors.push(code);
      continue;
    }

    let accum = 0;

    // Para múltiples espacios
    const clean = code.replace(/\s+/g, ' ');
    const tokens = [...clean.matchAll(/(\|+|\*+|\s+)/g)];

    for (const m of tokens) {
      const t = m[0];
      if (t.startsWith('|')) {
        const count = t.length;
        if (count === 1) accum += 5;
        else if (count === 2) accum *= 3;
        else accum = Math.pow(accum, count);
      } else if (t.startsWith('*')) {
        const count = t.length;
        if (count === 1) accum += 10;
        else if (count === 2) accum *= 2;
        else accum = accum ** 2;
      } else if (t.startsWith(' ')) {
        accum = Math.floor(accum / 2);
      }
    }

    if (catalog[accum]) {
      if (!invoice[accum]) {
        invoice[accum] = { nombre: catalog[accum], cantidad: 1 };
      } else {
        invoice[accum].cantidad++;
      }
    } else {
      errors.push(code);
    }
  }

  let total = 0;
  const items = Object.entries(invoice).map(([precio, { nombre, cantidad }]) => {
    const subtotal = parseInt(precio) * cantidad;
    total += subtotal;
    return { nombre, precio: parseInt(precio), cantidad, subtotal };
  });

  return { items, total, errors };
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Undefined method');
    return;
  }

  const { codigos } = req.body;
  const resultado = processBarcodes(codigos);
  res.status(200).json(resultado);
}
