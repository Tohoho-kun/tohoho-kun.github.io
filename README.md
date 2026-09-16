# Tohoho-kun Tech Platform

<p align="center">
  <strong>現場で使える直感的な技術計算シミュレーター ＆ 画像処理・AIツールスイート</strong><br>
  完全クライアントサイド動作 / サーバー送信なし / 多言語対応（日本語・English・Español）
</p>

<p align="center">
  <a href="https://tohoho-kun.github.io/"><strong>🌐 サイトを開く（tohoho-kun.github.io）</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-GitHub%20Pages-blue.svg" alt="GitHub Pages">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
  <img src="https://img.shields.io/badge/Three.js-3D%20Visualization-orange.svg" alt="Three.js">
  <img src="https://img.shields.io/badge/OpenCV.js-Image%20Processing-red.svg" alt="OpenCV.js">
  <img src="https://img.shields.io/badge/Gemini%20Live-Voice%20AI-purple.svg" alt="Gemini Live">
</p>

---

## 📌 概要 (Overview)

**Tohoho-kun Tech Platform** は、品質管理（QC/QA）、製造技術、機械設計、画像解析、およびAI音声翻訳のツールを1つに統合したオープンWebプラットフォームです。

すべてのシミュレーション・画像処理は**100%ユーザーのブラウザ内（ローカル）で完結**して実行されるため、機密データや画像が外部サーバーへ送信される心配がなく、セキュリティが重視される製造現場や研究開発環境でも安心して利用できます。

---

## 🛠️ 収録ツール一覧 (Tools & Features)

### 1. 📊 品質管理・統計エンジニアリング (Quality Engineering)

| ツール名 | URL / パス | 概要 |
| :--- | :--- | :--- |
| **プロセス・キャパビリティ (Cpk) シミュレーター** | [`#cpk`](https://tohoho-kun.github.io/#cpk) | 工程能力（Cp / Cpk）の直感的理解を深めるシミュレーター。正規分布理論曲線と実測値（散布図・ヒストグラム・N数丸め刻み）をリアルタイムに重ね合わせて比較・解析できます。 |
| **ゲージR&R アナライザー (MSA)** | [`#grr`](https://tohoho-kun.github.io/#grr) | 測定システム解析（ANOVA法 / Xbar-R法）。測定器の分解能や作業者の繰り返し性・再現性が工程能力に与える影響を評価し、「分解能改善」や「ばらつき低減」の改善効果を自動予測します。 |

---

### 2. 📐 設計・幾何公差・工学計算 (Design & Engineering)

| ツール名 | URL / パス | 概要 |
| :--- | :--- | :--- |
| **トルク単位変換 (N·m ⇄ lb·ft)** | [`#torque`](https://tohoho-kun.github.io/#torque) | 国際単位系（N·m）とヤードポンド法（lb·ft）の双方向リアルタイムトルク変換。デフォルト30 N·m設定、ワンクリック向き反転、スライダー/増減ボタン/テンキー入力、補助単位（kgf·m, in·lb 等）表示、自動車・締付プリセットおよび対照表を完備。 |
| **GD&T 位置度シミュレーター** | [`#gdt-position`](https://tohoho-kun.github.io/#gdt-position) | **Three.js による3D空間ビュー** と2D投影ビューで位置度（Position）公差の概念を視覚化。±公差（四角）と位置度（円）の違いや、最大実体公差方式（MMC / Ⓜ / ボーナス公差）を直感的に学べます。 |
| **記号・アイコン コンバイナー** | [`#symbol-combiner`](https://tohoho-kun.github.io/#symbol-combiner) | 丸・四角・三角・菱形などの幾何学図形と文字を組み合わせて、オリジナルの図記号やアイコンを作成。クリップボードへの画像コピー＆高解像度PNG保存に対応。 |

---

### 3. 🔬 画像解析・フォトレタッチ (Image Processing)

| ツール名 | URL / パス | 概要 |
| :--- | :--- | :--- |
| **溶接断面計測 (Weld-Blade)** | [`#weld`](https://tohoho-kun.github.io/#weld) | **OpenCV.js** を統合した4K画像対応の溶接マクロ断面計測ツール。すみ肉溶接の脚長・のど厚・溶け込み量をステップバイステップで高速計測。画像補正（明るさ/コントラスト/CLAHE）、キャリブレーション、属性記録付きエクスポートに対応。 |
| **圧縮フォーマット比較ツール** | [`image-compression-compare.html`](https://tohoho-kun.github.io/image-compression-compare.html) | WebP / AVIF / JPEG / PNG の画質とファイルサイズを横並びで比較。WASMによる高速エンコード、PSNR・RMSE・拡大差分マップによる客観的な画質評価が可能。 |
| **OKLab Tone Curve & Retouch** | [外部サイト](https://oklab-tone-editor.pages.dev) ([GitHub](https://github.com/Tohoho-kun/oklab-tone-curve-editor)) | 人間の知覚に均等な OKLab / OKLch / Okhsl 色空間を採用した高精度トーンカーブ調整・フォトレタッチWebアプリケーション。 |

---

### 4. 🤖 AI 音声翻訳スタジオ (AI & Voice)

| ツール名 | URL / パス | 概要 |
| :--- | :--- | :--- |
| **Gemini Live Bilingual Translator** | [`bilingual-translator.html`](https://tohoho-kun.github.io/bilingual-translator.html) | **Gemini Live API (WebSocket)** を活用した超低遅延リアルタイム日英双方向音声翻訳スタジオ。音声会話の自動ターン制御、リアルタイム字幕、AI要約・Q&Aアシスタント機能を統合。 |

---

## ✨ 主な特長 (Key Highlights)

- 🔒 **Zero-Backend & 高いプライバシー保護**: すべての計算・3Dレンダリング・画像解析がブラウザ内で実行されます。
- 🌓 **ダーク / ライトテーマ対応**: システムや好みに合わせてワンクリックで切り替え可能。設定は `localStorage` に自動保存されます。
- 🌐 **多言語対応 (i18n)**: 日本語、English、Español（スペイン語）に対応。
- 📱 **レスポンシブ設計**: PCだけでなくタブレットやスマートフォンでも閲覧・操作可能です。

---

## 💻 ローカルでの実行方法 (Local Development)

外部依存のビルドステップ（npm build 等）は不要です。静的ファイルをホストするだけで即座に動作します。

```bash
# 1. リポジトリのクローン
git clone https://github.com/Tohoho-kun/tohoho-kun.github.io.git
cd tohoho-kun.github.io

# 2. ローカルサーバーの起動（Python を使用する場合の例）
python3 -m http.server 8080

# 3. ブラウザでアクセス
open http://localhost:8080
```

---

## 📄 ライセンス (License)

This project is licensed under the [MIT License](LICENSE).