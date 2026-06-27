## Add Admin User Management

A new "Admins" tab in the dashboard where you can invite people to become admins by entering their **name** and **email**. They receive an email link to set their own password, and are automatically granted admin access.

### What you'll see

- A new **Admins** tab in the admin dashboard (alongside News, Events, Team, etc.)
- A list of all current admins showing their name, email, and "remove admin" button
- A form: **Name** + **Email** + **Send invite** button
- Toast feedback ("Invite sent to ...") when successful

### How it works

1. You enter a name and email and click **Send invite**
2. The system creates the account and emails them a secure link
3. They click the link, set a password, and land in the admin dashboard already signed in with admin rights
4. Their name appears in the admin list

### Technical details

**Database (migration):**
- New `profiles` table: `id` (uuid, PK = auth user id), `name` (text), `email` (text), `created_at`
- RLS: anyone authenticated can read profiles; users can update their own; admins can update any
- Trigger on `auth.users` insert → auto-creates a `profiles` row using metadata `name` and the user's email
- Add policies to `user_roles` so admins can `INSERT` and `DELETE` rows (currently only SELECT-own is allowed)

**Edge function `invite-admin`** (verify_jwt = true, validates caller is admin in code):
- Accepts `{ name, email }`, validates with Zod
- Uses service role key to call `supabase.auth.admin.inviteUserByEmail(email, { data: { name }, redirectTo: <site>/admin })`
- Inserts a row into `user_roles` with role `admin` for the new user id
- Returns success/error

**Edge function `remove-admin`** (verify_jwt = true):
- Accepts `{ user_id }`, verifies caller is admin and not removing themselves
- Deletes the matching row from `user_roles` (account itself is preserved)

**Frontend:**
- New `src/components/admin/AdminsTab.tsx` — list + invite form (zod-validated)
- `src/pages/Admin.tsx` — add the new tab
- Invite uses Lovable's default auth invite email (no custom branding setup needed). If you later want branded invite emails from your own domain, that's a separate optional step.

### Out of scope (ask if you want these)

- Custom-branded invite email template from your own domain
- Editing an existing admin's name/email
- Resending an invite if the user never accepted
