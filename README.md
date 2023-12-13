=============== REVIEW ===============

POST = http://localhost:5000/review
{
  "nilai": 1-5,
  "feedback": "blablabla",
  "userId": 1,
  "courseId": 2
}

GET ALL REVIEW = http://localhost:5000/allReview

GET BY ID COURSE = http://localhost:5000/reviews/1(id)

DELETE = http://localhost:5000/delete-review/1(id)

NOTE TOTAL REVIEW = tambah table (RANTING) untuk rata - rata ranting

untuk struktur folder nanti aku samain


=============== TRANSACTION ===============

Untuk transaction belum fiks (TOLONG DI CEK), AKU SESUAIKAN DENGAN DATABASE.

POST = http://localhost:5000/transaction
{
    "userId" : 2,
    "courseId" : 2,
    "paymentMethodId" : 1
}

GET-ALL = http://localhost:5000/all-transaction

DELETE = http://localhost:5000/delete-transaction/1(id)



