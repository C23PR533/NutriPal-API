# NutriPal-API (Beta)
NutriPal-API is a REST API that provides essential functionalities for nutrition and wellness management. It enables users to manage their user profiles, track favorite foods, access comprehensive food data, and monitor historical activity. With NutriPal-API, users can make informed dietary choices, maintain personalized preferences, and strive towards a healthier lifestyle.

# How To Use
Follow the instructions below to use the API effectively.

- Local Host: Run with Postman, local IP and Port:5000 `http://127.0.0.1:8000` or `http://localhost:8000`
- Online Domain (beta) : https://nutripal-api-beta-v1-dt3pitfd4q-et.a.run.app/

# Endpoint Routes

## Foods 🍽️
- ### 🔍 [GET] All foods 
Retrieves all data from the external JSON file.
Request:
```
  [GET] /foods/get-json-data/search
```
Response Code:
```
  - 200 (OK) if the data is retrieved successfully
  - 404 (Not Found) if the data is not found in the JSON file
```
Response Body:
```
[ALL FOODS DATA]
```

- ### 🔍 [GET] Search foods by Food Name
Retrieves data from the external JSON file based on the provided food name.
Request:
```
  [GET] /foods/get-json-data/search/:foodName
```
Response Code:
```
  - 200 (OK) if the data is found
  - 404 (Not Found) if the data with the given food name is not found
```
Response Body:
```
{
  "code": 200,
  "message": "Data berhasil didapatkan",
  "data": [
    {
      "food_name": "Lontong Sayur",
      "calories": "214",
      "food_id": "14959488"
    },
    ...
  ]
}
```

- ### 🔍 [GET] Food by Food ID
Retrieves data from the external JSON file based on the provided food ID.
Request:
```
  [GET] /foods/get-json-data/search/:foodName
```
Response Code:
```
  - 200 (OK) if the data is found
  - 404 (Not Found) if the data with the given food ID is not found
```
Response Body:
```
{
  "code": 200,
  "message": "Data berhasil didapatkan",
  "data": [
    {
      "food_name": "Lontong Sayur",
      "calories": "214",
      "food_id": "14959488"
    }
  ]
}

```

## Data Diri 👤
- ### 🔍 [GET] All User Data
Retrieves all data from the collection "dataDiri".
Request:
```
  [GET] /datadiri
```
Response Code:
```
  - 200 (OK)
```
Response Body:
```
  [
    {
      "id_user": "JFp2NUp3lMZek3s574GS1CQ9XN62",
      "nama": "John Doe",
      "nomor_hp": "081234567890",
      "email": "johndoe@example.com",
      "foto_profile": "https://example.com/profile.jpg",
      "gender": "Male",
      "birthdate": "1990-01-01"
    },
    {
      "id_user": "ABC123",
      "nama": "Jane Smith",
      "nomor_hp": "087654321098",
      "email": "janesmith@example.com",
      "foto_profile": "https://example.com/profile.jpg",
      "gender": "Female",
      "birthdate": "1995-05-10"
    }
  ]
```
- ### 🔍 [GET] User Data by id
Retrieves data from the collection "dataDiri" based on the provided ID User.
Request:
```
  [GET] /datadiri/:id_user
```
Response Code:
```
  - 200 (OK) if the data is found
  - 403 (Forbidden) if the user is not authenticated
  - 404 (Not Found) if the data with the given ID is not found
```
Response Body:
```
{
  "code": 200,
  "message": "Data berhasil didapatkan",
  "data": {
    "id_user": "JFp2NUp3lMZek3s574GS1CQ9XN62",
    "nama": "John Doe",
    "nomor_hp": "081234567890",
    "email": "johndoe@example.com",
    "foto_profile": "https://example.com/profile.jpg",
    "gender": "Male",
    "birthdate": "1990-01-01"
  }
}
```
- ### ✏️ [POST] Add User Data
Adds new data to the collection "dataDiri".
Request:
```
  [POST] /datadiri/:id_user
```
Request Body:
```
  - id_user (string, required): ID of the user.
  - nama (string, required): Name of the user.
  - nomor_hp (string): Phone number of the user.
  - email (string): Email of the user.
  - foto_profile (string): URL of the user's profile photo.
  - gender (string): Gender of the user.
  - birthdate (string): Birthdate of the user.
```
Response Code:
```
  - 200 (OK) if the data is found
  - 403 (Forbidden) if the user is not authenticated
  - 404 (Not Found) if the data with the given ID is not found
```
Response:
```
{
  "code": 200,
  "message": "Data berhasil ditambahkan"
}
```
- ### ✏️ [POST] Add Photo Profile
Adds new photo profile to the bucket "nutripall".
Request:
```
  [POST] /datadiri/photoprofile/:id_user
```
Request Body:
```
  - foto (file) = (id_user auto).jpg
```
Response Code:
```
  - 200 (OK) if the upload is success
  - 500 (Internal Server Error) if the server has some problem
```
Response:
```
{
  "code": 200,
  "message": 'File berhasil disimpan.', url: publicUrl
}
```


- ### 🔄 [PUT] Update User Data
Updates data in the collection "dataDiri" based on the provided ID.
Request:
```
  [PUT] /datadiri/:id_user
```
Request Body:
```
  - nama (string): Updated name of the user.
  - nomor_hp (string): Updated phone number of the user.
  - email (string): Updated email of the user.
  - foto_profile (string): Updated URL of the user's profile photo.
  - gender (string): Updated gender of the user.
  - birthdate (string): Updated birthdate of the user.
```
Response Code:
```
  - 200 (OK) if the data is updated successfully
  - 400 (Bad Request) if the required fields are missing or the user is not authenticated
  - 403 (Forbidden) if the user is not authenticated or authorized to update the data
```
Response Body:
```
{
  "code": 200,
  "message": "Data berhasil diupdate"
}
```
- ### 🗑️🔥 [DELETE] Delete User Data
Deletes data from the collection "dataDiri" based on the provided ID.
Request:
```
  [DELETE] /datadiri/:id_user
```
Response Code:
```
  - 200 (OK) if the data is deleted successfully
  - 400 (Bad Request) if the required fields are missing or the user is not authenticated
  - 403 (Forbidden) if the user is not authenticated or authorized to delete the data
  - 404 (Not Found) if the data with the given ID is not found
```
Response Body:
```
{
  "code": 200,
  "message": "Data berhasil dihapus"
}
```

## User Preferences 👤💡

- ### 🔍 [GET] User Preferences by ID User
Retrieves user preferences from the "userPreferences" collection in the database based on the provided ID.
Request:
```
  [GET] /userpreferences/:id_user
```
Response Code:
```
  - 200 (OK) if the data is found
  - 404 (Not Found) if the data with the given ID is not found
```
Response Body:
```
{
  "error": false,
  "message": "Data User Preference dengan id 12345 berhasil didapatkan",
  "listUserPreferences": {
    "id_user": "12345",
    "goals": "lose weight",
    "height": 170,
    "weight": 65,
    "gender": "male",
    "birthdate": "1990-01-01",
    "activityLevel": "moderate",
    "disease": ["diabetes"],
    "favoriteFood": ["salad", "grilled chicken"]
  }
}
```
- ### ✏️ [POST] Create User Preferences
Creates user preferences in the "userPreferences" collection in the database.
Request:
```
  [POST] /userpreferences/:id_user
```
Request Body:
```
  JSON object containing the user preferences.
```
Response Code:
```
  - 200 (OK) if the data is created successfully
  - 400 (Bad Request) if there is an error in the request or the data cannot be created
```
Response Body:
```
{
  "error": false,
  "message": "Data telah ditambahkan"
}
```
- ### 🔄 [PUT] Update User Preferences by ID User
Updates user preferences in the "userPreferences" collection in the database based on the provided ID.
Request:
```
  [PUT] /userpreferences/:id_user
```
Request Body:
```
  JSON object containing the user preferences.
```
Response Code:
```
  - 200 (OK) if the data is created successfully
  - 400 (Bad Request) if there is an error in the request or the data cannot be created
```
Response Body:
```
{
  "error": false,
  "message": "Data telah ditambahkan"
}
```
- ### 🗑️🔥 [DELETE] Delete User Preferences by ID User
Deletes user preferences from the "userPreferences" collection in the database based on the provided ID.
Request:
```
  [DELETE] /userpreferences/:id_user
```
Response Code:
```
  - 200 (OK) if the data is deleted successfully
  - 400 (Bad Request) if there is an error in the request or the data cannot be deleted
```
Response Body:
```
{
  "error": false,
  "message": "Data User Preference dengan id 12345 telah dihapus"
}
```

## History Activity 📝
- ### 🔍 [GET] All History Activity by ID
Retrieves all the history activity data for a specific user ID.
Request:
```
  [GET] /history_aktifitas/:id_user
```
Response Code:
```
  - 200 (OK) if the data is retrieved successfully
  - 404 (Not Found) if there is an error in the request or the data cannot be retrieved
```
Response Body:
```
{
  "code": 200,
  "error": false,
  "message": "Data History Activity dengan id 123 di temukan",
  "listHistoryActivity": {
    "id_user": "123",
    "History": [
      {
        "tanggal": "2023-05-29",
        "kalori_harian": 2000,
        "total_kalori": 1800,
        "sisa_kalori": 200,
        "aktifitas": {
          "kalori_masuk": [
            {
              "id_makanan": "1",
              "nama_makanan": "Nasi Goreng",
              "waktu": "07:00",
              "kalori": 800
            },
            {
              "id_makanan": "2",
              "nama_makanan": "Ayam Bakar",
              "waktu": "13:00",
              "kalori": 1000
            }
          ]
        }
      }
    ]
  }
}
```
- ### 🔍 [GET] All History Activity by ID and Date
Retrieves all the history activity data for a specific user ID and date.
Request:
```
  [GET] /history_aktifitas/:id_user/:tanggal
```
Response Code:
```
  - 200 (OK) if the data is retrieved successfully
  - 404 (Not Found) if there is an error in the request or the data cannot be retrieved
```
Response Body:
```
{
  "code": 200,
  "error": false,
  "message": "Data History Activity dengan id 123 dan tanggal 06-06-2023 ditemukan",
  "listHistoryActivity": {
    "id_user": "123",
    "History": [
      {
        "tanggal": "06-06-2023",
        "kalori_harian": 2000,
        "total_kalori": 1800,
        "sisa_kalori": 200,
        "aktifitas": {
          "kalori_masuk": [
            {
              "id_makanan": "1",
              "nama_makanan": "Nasi Goreng",
              "waktu": "07:00",
              "kalori": 800
            },
            {
              "id_makanan": "2",
              "nama_makanan": "Ayam Bakar",
              "waktu": "13:00",
              "kalori": 1000
            }
          ]
        }
      }
    ]
  }
}
```
- ### ✏️ [POST] Create history activity
Creates a new history activity entry for a user.
Request:
```
  [POST] /history_aktifitas
```
Request Body:
```
{
  "kalori_harian": 2000,
  "id_makanan": ["1", "2"],
  "nama_makanan": ["Nasi Goreng", "Ayam Bakar"],
  "kalori": [500, 300],
  "tanggal": "2023-05-30",
  "nama_exercise": ["Jogging", "Push Up"],
  "duration": [30, 15],
  "kalori_terbakar": [200, 100],
  "sisa_kalori": 1000
}
```
Response Code:
```
  - 200 (OK) if the data is created successfully
  - 401 (Unauthorized)
  - 400 (Bad Request) if there is an error in the request or the data cannot be created
```
Response Body:
```
{
  "code": 200,
  "error": false,
  "message": "Data History Activity dengan id 123 berhasil ditambahkan"
}
```
- ### 🔄 [PUT] Update history activity by ID User
Updates history activity in the "historyActivity" collection in the database based on the provided ID.
Request:
```
  [PUT] /history_aktifitas/:id_user
```
Response Code:
```
  - 200 (OK) if the data is update successfully
  - 400 (Bad Request) if there is an error in the request or the data cannot be updated
```
Response Body:
```
{
  "code": 200,
  "error": false,
  "message": "Data History Activity dengan id {id_user} berhasil diperbarui"
}

```
- ### 🗑️🔥 [DELETE] Delete history activity by ID User
Deletes user preferences from the "historyActivity" collection in the database based on the provided ID.
Request:
```
  [DELETE] /history_aktifitas/:id_user
```
Response Code:
```
  - 200 (OK) if the data is deleted successfully
  - 400 (Bad Request) if there is an error in the request or the data cannot be deleted
```
Response Body:
```
{
  "code": 200,
  "error": false,
  "message": "Data History Activity dengan id 123456789 telah dihapus"
}
```

## Favorite Food 🍔🌟
- ### 🔍 [GET] Favorite Foods by ID User
Retrieves favorite foods for a user from the "foodsFavorite" collection in the database.
Request:
```
  [GET] /foodsFavorite/:id_user
```
Response Code:
```
  - 200 (OK) if the data is retrieved successfully
  - 400 (Bad Request) if there is an error in the request or the required fields are missing
  - 404 (Not Found) if the favorite foods for the given user ID are not found
  - 500 (Internal Server Error) if there is an error on the server
```
Response Body:
```
{
  "error": false,
  "message": "Data berhasil didapatkan",
  "data": {
    "id_user": "12345",
    "favoriteFoods": [
      {
        "food_id": "12345",
        "food_name": "Burger",
        "calories": 500
      },
      ...
    ]
  }
}
```
- ### 🔍 [GET] Favorite Foods by ID User and Food ID
Retrieves a specific favorite food for a user from the "foodsFavorite" collection in the database based on the provided ID User and Food ID.
Request:
```
  [GET] /foodsFavorite/:id_user/:food_id
```
Response Code:
```
  - 200 (OK) if the data is retrieved successfully
  - 400 (Bad Request) if there is an error in the request or the required fields are missing
  - 404 (Not Found) if the favorite food for the given user ID and food ID is not found
  - 500 (Internal Server Error) if there is an error on the server
```
Response Body:
```
{
  "error": false,
  "message": "Data berhasil didapatkan",
  "data": {
    "id_user": "12345",
    "favoriteFoods": [
      {
        "food_id": "12345",
        "food_name": "Burger",
        "calories": 500
      }
    ]
  }
}
```
- ### ✏️ [POST] Add Favorite Food
Adds a favorite food for a user in the "foodsFavorite" collection in the database.
Request:
```
  [POST] /foodsFavorite/:id_user
```
Request Body:
```
  {
    "food_id": "12345",
    "food_name": "Burger",
    "calories": 500
  }
```
Response Code:
```
  - 201 (Created) if the favorite food is added successfully
  - 400 (Bad Request) if there is an error in the request or the required fields are missing
  - 500 (Internal Server Error) if there is an error on the server
```
Response Body:
```
{
  "code": 201,
  "error": false,
  "message": "Makanan favorit berhasil ditambahkan",
  "data": {
    "food_id": "12345",
    "food_name": "Burger",
    "calories": 500
  }
}

- ### 🗑️🔥 [DELETE] Delete Favorite Food by ID User and Food ID
Deletes a specific favorite food for a user from the "foodsFavorite" collection in the database based on the provided ID.
Request:
```
  [DELETE] /foodsFavorite/:id_user/:food_id
```
Response Code:
```
  - 200 (OK) if the data is deleted successfully
  - 400 (Bad Request) if there is an error in the request or the required fields are missing
  - 404 (Not Found) if the favorite food for the given user ID and food ID is not found
  - 500 (Internal Server Error) if there is an error on the server
```
Response Body:
```
{
  "error": false,
  "message": "Makanan favorit berhasil dihapus"
}
```
