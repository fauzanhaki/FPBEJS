
======================== PAYMENT METHOD ========================
POST = http://localhost:5000/api/v1/payment-method (login admin)
{
    "name" : "DANA"
}

GET = http://localhost:5000/api/v1/get-payment-method (login)

UPDATE = http://localhost:5000/api/v1/update-payment-method/7 (login admin)

DELETE = http://localhost:5000/api/v1/delete-payment-method/7 (login admin)
==============================================================

======================== AUTH REGISTER ========================
POST = http://localhost:5000/api/v1/register-user
{
  "username": "kevinarsn",
  "email": "user34@gmail.com",
  "password": "123456789",
  "name": "Kevin Arsan Kamto"
}

POST = http://localhost:5000/api/v1/register-admin (login admin)
{
  "username": "kevinarsn12345",
  "email": "kevinadmin4@gmail.com",
  "password": "123456789",
  "role": "admin || mentor",
  "name": "Kevin Arsan Kamto"
}

GET = http://localhost:5000/api/v1/me (login)
==============================================================

=========================== REVIEW ===========================
POST = http://localhost:5000/api/v1/review (login)

{
  "nilai": 5,
  "feedback": "blablabla",
  "courseId": 1
}


GET (all-review) = http://localhost:5000/api/v1/allReview

GET (by-course) = http://localhost:5000/api/v1/reviews/5

DELETE = http://localhost:5000/api/v1/delete-review/1 (login admin)
==============================================================

========================= TRANSACTION =========================
POST = http://localhost:5000/api/v1/transaction (login)
{
    "courseId" : 9,
    "paymentMethodId" : 5
}

GET (all-transaction) = http://localhost:5000/api/v1/all-transaction (login admin)

GET (my-transaction) = http://localhost:5000/api/v1/my-transaction (login)



==============================================================

========================== PROFILE ==========================
POST = http://localhost:5000/api/v1/create-profiles (login)
FORM DATA = name, phone, picture (file), city, province, country
DIGUNAKAN JIKA REGISTER TIDAK INPUT PROFILE

GET (all-profile) = http://localhost:5000/api/v1/all-profiles (login admin)

GET (my-profile) = http://localhost:5000/api/v1/my-profile (login)

PUT = http://localhost:5000/api/v1/update-my-profile (login)
FORM DATA = name, phone, picture (file), city, province, country

DELETE = http://localhost:5000/api/v1/delete-profile/1 (login admin)
==============================================================


