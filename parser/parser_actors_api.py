import time
import requests
from postgres import update_person_db

def get_person(actor_id):
    url_staff= f'https://kinopoiskapiunofficial.tech/api/v1/staff/{actor_id}'
    time.sleep(2)
    headers = {
        'X-API-KEY':  '2e75e925-df56-49cc-9de9-70308b806833',
        'Content-Type': 'application/json',
    }
    try:
        total_list = []
        response_staff = requests.get(url_staff, headers=headers)
        data = response_staff.json()
        person_id = data['personId']
        person_webUrl = data['webUrl']
        person_posterUrl = data['posterUrl']
        person_growth = data['growth']
        person_sex = data['sex']
        person_nameRu = data['nameRu']
        person_nameEn = data['nameEn']
        person_age = data['age']
        person_birthday = data['birthday']
        person_birthplace = data['birthplace']
        person_profession = data['profession']
        person_films = data['films']
        films_list = []
        for i in range(len(person_films)):
            filmsId = person_films[i]['filmId']
            films_list.append(filmsId)
        list_person = [person_id, 
                       person_webUrl, 
                       person_posterUrl, 
                       person_sex,
                       person_nameRu, 
                       person_nameEn, 
                       person_growth,
                       person_age, 
                       person_birthday, 
                       person_birthplace, 
                       person_profession,
                        films_list]
        total_list.append(list_person)
        update_person_db(total_list, 'person_api')
        print('Актер', total_list, 'спаршен')
    except requests.exceptions.RequestException as e:
        print(f"Страницы не существует", e)

def main():
    start = time.time()
    actor_id = 3000
    while actor_id != 4001:
        get_person(actor_id)
        print(f"Человек под id:{actor_id} спаршен")
        actor_id += 1
    end = time.time()
    total = round((end-start)/60, 1)
    print('Время выполнения парса =', total , 'минут')

if __name__ == "__main__":
    main()    