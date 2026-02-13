# Testing

## Real-time updates (two-tab test)

To verify that reserve/contribute events appear instantly on all open views:

1. **Start backend and frontend**
   - Backend: `cd Backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
   - Frontend: `cd Frontend && npm run dev` (e.g. http://localhost:3000)

2. **Owner tab**
   - Log in and open a wishlist that has at least one item with a price.
   - Go to **Dashboard → [your wishlist]** (edit view).
   - Copy the public share link (e.g. “Скопировать ссылку”) or note the URL like `/w/xxxx`.

3. **Public tab (incognito)**
   - Open an incognito/private window (or another browser).
   - Paste the public link (e.g. `http://localhost:3000/w/xxxx`).
   - You should see the loading skeleton, then the same wishlist with items.

4. **Trigger updates**
   - In the **public tab**: reserve an item fully or contribute a partial amount (enter name/amount and submit).
   - In the **owner tab**: the list should update **immediately** (e.g. item count / progress) without refresh.
   - In the **public tab**: progress bar and “Собрано” badges should update immediately after your action.

5. **Optional: second public tab**
   - Open the same public link in another incognito tab.
   - Reserve or contribute from one public tab; both public tabs and the owner tab should show the same updated state.

### What you’re checking

- **Loading**: Skeleton appears while the initial fetch runs (and before WebSocket is ready).
- **Reconnect**: If you restart the backend briefly, the “Переподключение…” banner should appear, then disappear when the WebSocket reconnects.
- **No crash**: Backend logs send failures but keeps running; frontend keeps working if the WebSocket drops and reconnects.
