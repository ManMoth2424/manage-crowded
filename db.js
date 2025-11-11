// db.js
const { Pool } = require('pg');

// ★【重要】Renderなどのデプロイ先では DATABASE_URL という環境変数を使う
// ローカルでテストする場合も、この名前で環境変数を設定する
// (もし設定が面倒なら、一時的に connectionString: 'コピーしたNeonのURL' でも可)
const connectionString = process.env.DATABASE_URL; 

if (!connectionString) {
  throw new Error("DATABASE_URL 環境変数が設定されていません。");
}

const pool = new Pool({
  connectionString: connectionString,
  // Neon (SSL/TLS) に接続するための設定
  ssl: {
    rejectUnauthorized: false 
  }
});

// db.all や db.run の代わり
// pool.query() でSQLを実行できるようにする
module.exports = {
  query: (text, params) => pool.query(text, params),
};