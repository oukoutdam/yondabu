# ヨンダブ

これは、FastAPIとReactを連携させる練習として作成したアプリです。
フロントエンドのフォームから数字を送信し、バックエンドでその数字を保存します。
その後、ページをリフレッシュしたり、別のブラウザでアクセスしたりしても、保存された数字が表示されるようになっています。

## 開発環境の実行手順
### 1. リポジトリをクローンし、中に入る
```
git clone https://github.com/oukoutdam/fastapi-react-number-setter.git
cd fastapi-react-number-setter
```
### 2. バックエンドを起動する
   
#### 2.1 ディレクトリに移動
```
cd backend
```
#### 2.2 Pythonの仮想環境準備
```
python -m venv .venv
```
#### 2.3 Pythonの仮想環境を使用
Windows
```
.\.venv\Scripts\activate
```
Mac or Linux
```
source .venv/bin/activate
```
#### 2.4 `FastAPI`のインストール
```
pip install -r requirements.txt
```
#### 2.5 サーバを起動する
```
fastapi dev main.py
```
#### 3. フロントエンドを起動する
   
#### 3.1 ディレクトリに移動
```
cd ../frontend
```
#### 3.2 パッケージのインストール
```
npm install
```
#### 3.3 フロントエンドサーバの起動
```
npm run dev
```
#### 4. フロントエンドのリンクにアクセス
```
# 多分これ
http://localhost:5173/
```

