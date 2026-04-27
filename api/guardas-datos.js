import { createClient } from '@supabase/supabase-js';

// Inicializamos el cliente de Supabase usando variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
    // Solo permitimos el método POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    // Los datos del formulario llegan en req.body
    const { id, name, price } = req.body;

    try {
        // Insertar datos en la tabla 'productos'
        const { data, error } = await supabase
            .from('productos') 
            .insert([
                { 
                    id: parseInt(id), 
                    name: name, 
                    price: parseFloat(price) 
                }
            ]);

        if (error) throw error;

        // Respuesta tras éxito (puedes redirigir o mostrar un mensaje)
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(`
            <h1>¡Producto guardado!</h1>
            <p>El producto ${name} ha sido registrado.</p>
            <a href="/">Volver al formulario</a>
        `);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}