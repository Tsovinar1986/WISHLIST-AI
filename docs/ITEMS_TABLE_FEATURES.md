# Items table: adding, removing, ordering

This describes the **product** behaviour of the wishlist items (the “table parts”) — no code, just what the app does.

---

## Adding items

- **Where:** Dashboard → open a wishlist → “Добавить подарок” / “Add gift”.
- **What you can set:** Title, price (optional), product URL (optional), image URL (optional). If you paste a product URL, the app can try to fill title, price, and image from the page.
- **Result:** The new item appears in the list. Order: new items go to the end by default (you can move them with ↑/↓).

---

## Removing items

- **Where:** Same wishlist edit view; each item has a “Удалить” (Delete) button.
- **What happens:** You’re asked to confirm. After confirm, the item is removed from the list and from the database. The order of the other items stays the same.

---

## Ordering items

- **Where:** Same wishlist edit view; each item has **↑** (move up) and **↓** (move down) buttons.
- **Behaviour:**
  - **↑** moves the item one position up (e.g. from 3rd to 2nd).
  - **↓** moves the item one position down (e.g. from 2nd to 3rd).
  - The first item has ↑ disabled; the last item has ↓ disabled.
- **Result:** The list order is saved. The same order is used on the public wishlist page (`/w/[slug]`).

---

## Summary

| Action   | How |
|----------|-----|
| **Add**  | “Добавить подарок” form: title, price, URLs. New item appears at the end. |
| **Remove** | “Удалить” on the item → confirm → item is removed. |
| **Order** | ↑ and ↓ on each item to move it up or down; order is saved and shown everywhere. |

After login, the dashboard shows your wishlists; open one to add items, remove them, and change their order with the table controls above.
