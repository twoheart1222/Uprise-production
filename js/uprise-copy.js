// 網站上所有固定文字（後台「網站文字」可修改；留白則使用這裡的預設值）
// 按 Enter 換行；{n}、{name}、{email} 會自動帶入數字、姓名、信箱
export const COPY = [
  { group: "全站：導覽列與開場", items: [
    ["brand", "導覽列品牌名", "UPRISE®"],
    ["nav_home", "導覽：首頁", "首頁"], ["nav_works", "導覽：作品", "作品"], ["nav_about", "導覽：關於", "關於"], ["nav_contact", "導覽：聯絡", "聯絡"],
    ["intro_title", "開場動畫：主字", "推手影像"], ["intro_sub", "開場動畫：副字", "UPRISE PRODUCTION"]
  ] },
  { group: "全站：頁尾", items: [
    ["foot_cta", "頁尾大標", "有故事？\n我們開機。"], ["foot_btn", "頁尾圓形按鈕", "開始合作"], ["foot_pages", "頁尾：頁面標題", "頁面"],
    ["lbl_email", "標籤：Email", "EMAIL"], ["lbl_phone", "標籤：電話", "PHONE"], ["lbl_studio", "標籤：地址", "STUDIO"],
    ["foot_company", "公司名稱", "推手影像製作有限公司"], ["foot_copyright", "版權文字（年份自動）", "UPRISE-PRODUCTION"]
  ] },
  { group: "首頁", items: [
    ["home_est", "主視覺：成立年份", "EST. 2025"], ["home_scroll", "主視覺：滑動提示", "滑動進入"],
    ["home_reel_label", "影片段：小標", "SHOWREEL"], ["home_reel_title", "影片段：標題", "推手影像 作品精華"], ["home_reel_link", "影片段：連結", "看完整作品 →"],
    ["home_sound_off", "聲音按鈕（關）", "SOUND OFF"], ["home_sound_on", "聲音按鈕（開）", "SOUND ON"],
    ["home_mani_label", "理念：小標", "01 / 我們相信"],
    ["home_sel_label", "精選作品：小標", "02 / 精選作品"], ["home_sel_title", "精選作品：大標", "Selected\nWorks"], ["home_sel_btn", "精選作品：按鈕（{n}=作品數）", "查看全部 {n} 部作品 →"], ["home_preview", "精選作品：預覽標籤", "PREVIEW"],
    ["home_svc_title", "服務：大標", "從一個想法\n到最後一格。"], ["home_svc_label", "服務：小標", "03 / 我們做什麼"], ["home_svc_link", "服務：連結", "認識團隊與流程 →"]
  ] },
  { group: "作品頁", items: [
    ["works_all", "分類：全部", "全部"], ["works_prev", "上一部", "↑ PREV"], ["works_next", "下一部", "↓ NEXT"], ["works_hint", "滾動提示（電腦）", "滾動切換"], ["works_mhint", "滑動提示（手機）", "↑ 上下滑動切換作品 ↓"],
    ["works_client", "客戶標籤", "CLIENT"], ["works_play", "播放提示", "點擊畫面播放完整影片"]
  ] },
  { group: "關於頁", items: [
    ["about_label", "頁首小標（接在關於標題後）", "ABOUT"],
    ["about_proc_label", "流程：小標", "01 / 製作流程"], ["about_proc_title", "流程：大標", "PRO—\nCESS"], ["about_proc_text", "流程：說明", "從一個想法，到最後一格。每一步都與你同步。"],
    ["about_bts_label", "花絮：小標", "02 / 片場花絮 ON SET"], ["about_bts_title", "花絮：大標", "鏡頭之外。"], ["about_bts_text", "花絮：說明", "燈光、走位、一次又一次的 Take——畫面之外的每個細節，都是成片的一部分。"],
    ["about_crew_title", "團隊：大標", "影像職人"], ["about_crew_label", "團隊：小標", "03 / THE CREW"], ["about_crew_hint", "團隊：提示", "點選照片，看完整介紹"], ["about_credits", "團隊：經歷標題", "CREDITS — 經歷與作品"]
  ] },
  { group: "聯絡頁", items: [
    ["contact_label", "頁首小標", "聯絡我們 — CONTACT"],
    ["contact_q1", "問題 1", "專案類型（可複選）"], ["contact_types", "問題 1 選項（一行一個）", "品牌形象\n活動紀錄\n產品影片\n公部門專案\nFPV / 空拍\n其他"],
    ["contact_q2", "問題 2", "預算範圍"], ["contact_budgets", "問題 2 選項（一行一個）", "10 萬以下\n10–30 萬\n30–60 萬\n60 萬以上\n尚未確定"],
    ["contact_q3", "問題 3", "預計上線時間"], ["contact_times", "問題 3 選項（一行一個）", "一個月內\n1–3 個月\n3 個月以上\n尚未確定"],
    ["contact_q4", "問題 4", "你的資訊"],
    ["contact_f_name", "欄位：姓名", "姓名 *"], ["contact_f_company", "欄位：公司", "公司 / 單位"], ["contact_f_email", "欄位：Email", "EMAIL *"], ["contact_f_phone", "欄位：電話", "電話"], ["contact_f_msg", "欄位：訊息", "想說的話"],
    ["contact_msg_ph", "訊息欄提示文字", "簡單描述你的想法、參考影片或需要的交付格式"],
    ["contact_submit", "送出按鈕", "送出需求"], ["contact_note", "送出按鈕旁說明", "我們會在兩個工作天內回覆。"], ["contact_sending", "傳送中文字", "傳送中…"],
    ["contact_big", "頁尾大字", "推手影像"],
    ["contact_thanks_label", "送出後：小標", "● REC — 已收到"], ["contact_thanks_title", "送出後：大標（{name}=姓名）", "謝謝，{name}。\n我們很快聯絡你。"],
    ["contact_thanks_ok", "送出成功說明", "需求已送出，我們會盡快回覆。"], ["contact_thanks_mail", "改用郵件說明（{email}=信箱）", "已開啟你的郵件程式；若沒有自動開啟，請直接寄信至 {email}。"],
    ["contact_after", "送出後按鈕", "先看看作品 →"]
  ] }
];
export const COPY_DEF = Object.fromEntries(COPY.flatMap((g) => g.items.map(([k, , d]) => [k, d])));
