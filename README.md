# Backend HH Test for Nika

### Install

1. ```npm install```
2. Change .env file
3. ```npm run migration:generate ./migrations/your_migration_name```
4. ```npm run migration:run```
5. Change common/config/mailer.config
6. ```npm run start```


### API


- GET /requests: Get a list of requests.
* Params:
```typescript
    take?: number
    list?: number
    status?: 'active' | 'denied' | 'resolved'
    order?: 'createAt' | 'status'
    orderType?: 'asc' | 'desc' = 'asc'
```
- POST /requests: Create a new request
* Params:
```typescript
    name: string
    email: string
    message: string
```
- PUT /requests/:id: Change a request
Params:
```typescript
    comment: string
    status: 'resolved' | 'denied'
```