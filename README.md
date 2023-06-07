# NutriPal-API (Beta)
NutriPal-API is a REST API that provides.....

# How To Use
Follow the instructions below to use the API effectively.

- Local Host: Run with Postman, local IP and Port:5000 `http://127.0.0.1:8000` or `http://localhost:8000`
- Online Domain : not published yet

# Endpoint Routes

## Foods
- ### [GET] Search foods
Send a GET request to `/foods/get-json-data/search/` to retrieve all foods by name.

Request:
```
  [GET] /foods/get-json-data/search/:foodName
```

Response:
```
{
    {
        "code": 200,
        "message": "Data berhasil didapatkan",
        "data": [
            {
                "food_id": "39945",
                "food_name": "Hamburger (Single Patty with Condiments)",
                "food_type": [
                    "Generic",
            ....
                "servings": {
                    "serving": [
                        {
                            "calcium": "59",
                            "calories": "120",
                            "carbohydrate": "21.26",
            ....
            {
                "food_id": "39055",
                "food_name": "Hamburger or Hotdog Rolls",
                "food_type": [
                    "Generic",
            ....
```

## User Preferences
- ### [GET] User Preferences by id_user
Send a GET request to `/userpreferences/:id_user` to retrieve user preferences data by id_user.

Request:
```
  [GET] /userpreferences/:id_user
```

Response:
```
{
    "birthdate": "01-06-2023",
    "disease": [
        "hypertension",
        "Heart",
        "Obesity"
    ],
    "gender": "Male",
    "favoriteFood": [
        "Nasi Goreng",
        "Mie"
    ],
    "weight": "60",
    "id_user": "JFp2NUp3lMZek3s574GS1CQ9XN62",
    "activityLevel": "1.2",
    "goals": "0",
    "height": "168"
}
```
