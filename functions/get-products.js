const { neon } = require('@neondatabase/serverless');

exports.handler = async () => {
    const sql = neon(process.env.DATABASE_URL);
    
    try {
        const data = await sql`SELECT * FROM products ORDER BY id DESC`;
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                // THE SHIELD: Caches the data for 1 hour to protect your Neon compute limits
                "Cache-Control": "public, max-age=3600, s-maxage=3600" 
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Vault Connection Failed" }) 
        };
    }
};
