# Lab2_microservices_shop_N23DCCN035_PhamThanhLong

## Supabase keepalive

Repo co GitHub Actions workflow `.github/workflows/supabase-keepalive.yml` de ping Supabase dinh ky moi 3 ngay, giup database khong bi inactive.

Project da duoc flatten de cac service nam ngay o root repo:

```txt
api-gateway/
auth-service/
order-service/
product-service/
maintenance/
```

Can them repository secret:

```txt
SUPABASE_DATABASE_URL=postgresql://...
```

Nen dung direct connection string cua Supabase, khong commit `.env` that vao git.
