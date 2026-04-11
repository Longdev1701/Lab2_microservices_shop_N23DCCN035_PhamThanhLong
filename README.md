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

Railway root `Dockerfile` hien tai build va chay tat ca Node services trong cung mot container, public qua API Gateway. Khi deploy kieu nay, can set bien moi truong cho ca 4 service tren cung Railway service.

Can them repository secret:

```txt
SUPABASE_DATABASE_URL=postgresql://...
```

Nen dung direct connection string cua Supabase, khong commit `.env` that vao git.
