// init-db.js
const sqlite3 = require('sqlite3').verbose();

// 'bunkasai.db' というファイル名でデータベースを開く（なければ作成）
const db = new sqlite3.Database('./bunkasai.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('bunkasai.db に接続しました。');
});

// データベースの処理を順番に実行
db.serialize(() => {
  console.log('テーブルを作成します...');
  // テーブル作成 (もし存在していなければ作成)
  db.run(`CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT,
    exhibit_name TEXT,
    status TEXT
  )`, (err) => {
    if (err) return console.error(err.message);
    console.log('locations テーブルが作成されました。');
  });

  // 初期データの投入
  console.log('初期データを挿入します...');
  const stmt = db.prepare("INSERT INTO locations (class_name, exhibit_name, status) VALUES (?, ?, ?)");
  
  const initialData = [
    ['1年A組', 'お化け屋敷', '普通 🙂'],
    ['体育館', 'ステージ発表', '普通 🙂'],
    ['中庭', '模擬店A（やきそば）', '空き 🤩'],
    ['図書室', '休憩所', '普通 🙂'],
    ['2年B組', '縁日', '混雑 😥']
  ];
  
  // (注：このスクリプトは何度も実行するとデータが重複します)
  initialData.forEach(data => {
    stmt.run(data, (err) => {
      if (err) return console.error(err.message);
    });
  });
  
  stmt.finalize(() => {
    console.log('初期データの挿入が完了しました。');
    
    // データの確認 (任意)
    db.all("SELECT * FROM locations", [], (err, rows) => {
      if (err) return console.error(err.message);
      console.log('現在のデータ:');
      console.table(rows);
      
      // 最後に接続を閉じる
      db.close((err) => {
        if (err) console.error(err.message);
        console.log('データベース接続を閉じました。');
      });
    });
  });
});