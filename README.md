# NutriPal-API (Beta)
NutriPal-API is a REST API that provides.....

# How To Use
Follow the instructions below to use the API effectively.

- Local Host: Run with Postman, local IP and Port:5000 `http://127.0.0.1:8000` or `http://localhost:8000`
- Online Domain : not published yet

# Endpoint Routes

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
                            "calcium": "126",
            ....
                            "vitamin_c": "2.2"
                        }
                    ]
                }
            },
            ....
                    ]
                }
            },
            {
                "food_id": "39055",
                "food_name": "Hamburger or Hotdog Rolls",
                "food_type": [
                    "Generic",
            ....
                        {
                            "calcium": "59",
                            "calories": "120",
                            "carbohydrate": "21.26",
                             ....
                            "vitamin_c": "0.0"
                        }
                    ]
                }
            }
        ]
    }
}
```
