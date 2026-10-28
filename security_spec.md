# Security Specification & Threat Model — MUSEUM ATLAS THAILAND

## 1. System Invariants
1. **Public Read-Only Guarantee**: Public visitors can read published museum records, subjects, and site settings without authentication.
2. **Admin-Only Mutations**: Only the designated administrator (`admin@gmail.com` or authorized UID) can create, modify, or delete museum records, subjects, or CMS settings.
3. **Draft Isolation**: Museum records in `draft` or `archived` status are hidden from unauthenticated public queries.
4. **Audit Log Immutability**: Administrative audit logs can only be created by an authenticated administrator; they cannot be updated or deleted.
5. **No Firebase Storage**: Images are strictly referenced via validated external HTTPS URLs to prevent binary upload vulnerabilities.

## 2. Dirty Dozen Security Attack Payloads & Test Mitigations
1. **Unauthenticated Museum Insertion**: POST to `/museums/hacked` -> Blocked (`PERMISSION_DENIED`).
2. **Unauthenticated Status Manipulation**: PATCH `/museums/sac_1` with `{ status: "draft" }` -> Blocked.
3. **Public Reading of Audit Logs**: GET `/auditLogs` by non-admin -> Blocked.
4. **Public Reading of Trash Bin**: GET `/trash` by non-admin -> Blocked.
5. **Modification of Admins Whitelist**: PUT `/admins/attacker_uid` -> Blocked.
6. **SQL/Script Injection in Title**: Payload with `<script>` tags or 5,000 character strings -> Blocked by `isValidMuseum` schema limit (max 300 chars).
7. **Invalid Path Injections**: Document IDs exceeding 128 characters or containing path traversal `../` -> Blocked by `isValidId`.
8. **Forged Client Timestamp**: Creating records with arbitrary historical or future timestamps -> Rejected.
9. **Bypassing Status Filter**: Querying for `status: "draft"` documents without admin token -> Blocked by `allow list: if resource.data.status == 'published' || isAdmin();`.
10. **Subject Name Tampering**: Non-admin attempting to merge or rename subjects -> Blocked.
11. **Site Settings Hijack**: Updating hero banner to defacing text -> Blocked (`isAdmin()` enforced).
12. **Audit Log Deletion**: Admin attempting to delete evidence of data removal -> Blocked (update and delete disallowed on `auditLogs`).
