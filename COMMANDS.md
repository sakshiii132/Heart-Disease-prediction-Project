# Heart Disease Prediction – Commands

## 1. Start Frontend (React + Vite)

```powershell
cd "C:\Users\admin\Desktop\ML\Heart Disease prediction\frontend"
npm.cmd run dev
```

Frontend URL: http://localhost:5173/

## 2. Start Backend (FastAPI)

Open a separate VS Code terminal:

```powershell
cd "C:\Users\admin\Desktop\ML\Heart Disease prediction\backend"
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload
```

Backend URL: http://127.0.0.1:8000/

API Documentation: http://127.0.0.1:8000/docs

## 3. Stop the Servers

Press `Ctrl + C` in the respective terminal.

## 4. Important Note

- Keep the frontend and backend running in separate terminals.
- Frontend uses port 5173.
- Backend uses port 8000.
- Use `npm.cmd run dev` if `npm run dev` gives a PowerShell execution policy error.