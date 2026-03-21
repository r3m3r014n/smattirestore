const { neon } = require('@neondatabase/serverless');

exports.handler = async () => {
    const sql = neon(process.env.DATABASE_URL);
    try {
        const data = await sql`SELECT * FROM products ORDER BY id DESC`;
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
