# Sophia & Kaiho 婚禮請柬

2027 年 2 月 20 日，The White Barn HK。

## 狀態

網站及私人 Google Sheets 後台已建立，Apps Script 已部署。實際提交、同一回覆更新及人數統計測試已通過；測試資料已清除。GitHub Pages 公開發佈尚待完成。

## 本地預覽與 GitHub Pages

使用 Node 22.13 或更新版本及 pnpm。執行 `pnpm install`，再執行 `pnpm exec vite --config vite.github.config.ts`。

以 `pnpm exec vite build --config vite.github.config.ts` 產生 `dist-github`，該資料夾為 GitHub Pages 的完整靜態網站。所有圖片路徑均為相對路徑。

## 私人 Google Sheets 後台

1. 已在婚禮專用帳戶建立原生 Google Sheet，包含「出席統計」及「親友回覆」分頁。請保留分頁名稱及欄位順序。
2. 在婚禮帳戶建立 Apps Script 專案，加入 `backend/Code.gs` 及 `backend/appsscript.json`。
3. `backend/Code.gs` 的 `id` 為統計表 ID；如更換統計表，請一併更新及重新部署。
4. 部署 Web app，執行身分為婚禮帳戶，訪問者為 Anyone。此程式僅接受回覆，不提供任何賓客資料讀取介面。Google Sheet 保持私人，勿設為知道連結的任何人可查看。
5. 將 Web app 的 `/exec` 網址填入 `lib/config.ts` 的 `RSVP_ENDPOINT`，重新建置及發佈。
6. 驗證跨網域提交、Google Sheet 資料、總人數及同裝置更新均正確後，才向親友發送連結。

回覆編號存於賓客瀏覽器，用於同裝置更新。清除瀏覽器資料或轉用裝置後需由新人協助合併重複回覆。後台以鎖避免同時寫入衝突，驗證整數及欄位長度，防止文字被當作試算表公式。統計範圍涵蓋最多 9,999 組回覆。

## 尚待新人確認

接駁車集合地點、班次及泊車安排；回覆截止日期（目前沒有擅自填入）；不同環節的同行人數如有差異，暫以備註跟進。

場地地址查核來源：https://plantoo.com.hk/listing/the-white-barn/

照片為新人提供，僅供本婚禮網站使用。水墨植物插畫由 ImageGen 製作。
