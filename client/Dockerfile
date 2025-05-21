FROM node:20-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package 檔案並安裝依賴
COPY package.json package-lock.json ./
RUN npm install

# 複製其餘檔案（或透過 volume 掛載）
COPY . .

# 開放 Vite dev server 預設 port
EXPOSE 5173

# 啟動 Vite 開發伺服器
CMD ["npm", "run", "dev"]
