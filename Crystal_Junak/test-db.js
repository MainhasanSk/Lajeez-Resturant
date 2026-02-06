/* eslint-disable */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key Length:', supabaseKey ? supabaseKey.length : 0);

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error('Supabase Error:', error);
        } else {
            console.log('Success! Products found:', data.length);
            console.log('First product:', data[0]);
        }
    } catch (err) {
        console.error('Unexpected Error:', err);
    }
}

test();
