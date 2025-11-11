// routes/index.js
var express = require('express');
var router = express.Router();
var db = require('../db'); // ★pg用に書き換えた db.js

/* GET / (トップページ・一覧表示) */
// ★ async 関数に変更
router.get('/', async function(req, res, next) {
  try {
    // ★db.all(...) のコールバックを await db.query(...) に変更
    const { rows } = await db.query('SELECT * FROM locations');
    
    res.render('index', { 
      title: '文化祭 混雑状況一覧',
      data: rows 
    });
  } catch (err) {
    // エラー処理
    return next(err);
  }
});

module.exports = router;