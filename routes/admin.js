// routes/admin.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // ★SQLite用の db.js を読み込む

// ★★★ 事前に決めておく共通パスワード ★★★
// 本番環境では、もっと複雑な文字列にしてください。
const ADMIN_PASSWORD = "bunkasai_pass"; 

/* * GET /admin/ 
 * ログインページを表示します。
 * もし既にログインしていたら、/admin/update へリダイレクトします。
 */
router.get('/', (req, res, next) => {
  // 既にログイン済みのセッションがあるかチェック
  if (req.session.isLoggedIn) {
    res.redirect('/admin/update'); // ログイン済みなら更新ページへ
    return;
  }
  
  // ログインしていない場合、ログインページを描画
  // セッションに保存されたエラーメッセージを取得 (あれば)
  const error = req.session.error;
  req.session.error = null; // メッセージを一度表示したら消去
  
  res.render('admin/index', { 
    title: '管理者ログイン', 
    error: error // エラーメッセージをEJSに渡す
  });
});

/* * POST /admin/login
 * ログインフォームから送信されたパスワードを処理します。
 */
router.post('/login', (req, res, next) => {
  const password = req.body.password; // フォームから送られたパスワード

  if (password === ADMIN_PASSWORD) {
    // パスワードが一致
    req.session.isLoggedIn = true; // セッションに「ログイン成功」の印をつける
    req.session.error = null; // エラーをクリア
    res.redirect('/admin/update'); // 成功したら更新ページへ (このページは別途作成)
  } else {
    // パスワードが不一致
    req.session.error = 'パスワードが違います'; // エラーをセッションに保存
    res.redirect('/admin'); // ログインページに戻す
  }
});

/* * GET /admin/logout
 * ログアウト処理
 */
router.get('/logout', (req, res, next) => {
  // セッションを破棄
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    // ログアウト後はトップページ（閲覧者ページ）に戻る
    res.redirect('/'); 
  });
});


// ★★★ ログイン認証チェック ミドルウェア (後で使います) ★★★
// ログインしていないとアクセスできないページを作るための関数
function requireLogin(req, res, next) {
  if (req.session.isLoggedIn) {
    next(); // ログインしているので、次の処理へ進む
  } else {
    req.session.error = 'ログインが必要です';
    res.redirect('/admin'); // ログインしていないので、ログインページへ
  }
}

/* * GET /admin/update
 * (保護されたページ) 混雑状況の更新ページ。
 * このページは、`requireLogin` によって守られます。
 */
/* * GET /admin/update
 * (保護されたページ) 混雑状況の更新ページ。
 * ★ async/await に変更 ★
 */
router.get('/update', requireLogin, async (req, res, next) => {
  try {
    // ★ db.all(...) を await db.query(...) に変更
    const { rows } = await db.query('SELECT * FROM locations');
    
    res.render('update', { 
      title: '混雑状況 更新', 
      data: rows 
    });
  } catch (err) {
    return next(err);
  }
});

/* * POST /admin/update-status
 * (保護されたページ) 更新フォームの送信先
 * ★ async/await に変更 ★
 */
router.post('/update-status', requireLogin, async (req, res, next) => {
  const { locationId, newStatus } = req.body; 

  // ★ PostgreSQLではプレースホルダーが ? ではなく $1, $2 になる
  const sql = 'UPDATE locations SET status = $1 WHERE id = $2';
  
  try {
    // ★ db.run(...) を await db.query(...) に変更
    await db.query(sql, [newStatus, locationId]);
    
    console.log('DBデータが更新されました。');
    res.redirect('/admin/update');
    
  } catch (err) {
    return next(err);
  }
});

module.exports = router;