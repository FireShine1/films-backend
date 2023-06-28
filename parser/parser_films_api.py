import time
import requests
from postgres import update_film_db
from parser_actors_api import get_person

def get_films(films_id):
    try:    
        total_list = []
        url = f'https://kinopoiskapiunofficial.tech/api/v2.2/films/{films_id}'
        url_video = f'https://kinopoiskapiunofficial.tech/api/v2.2/films/{films_id}/videos'
        url_staff = f'https://kinopoiskapiunofficial.tech/api/v1/staff?filmId={films_id}'
        headers = {
            'X-API-KEY':  '2e75e925-df56-49cc-9de9-70308b806833',
            'Content-Type': 'application/json',
        }
        response_staff = requests.get(url_staff, headers=headers)
        response = requests.get(url, headers=headers)
        time.sleep(1)
        films_info_card = []
        data = response.json()
        film_id = data['kinopoiskId']
        film_name_ru = data['nameRu']
        film_name_en = data['nameOriginal']
        film_web_url = data['webUrl']
        film_shortDescription = data['shortDescription']
        film_year = data['year']
        film_filmLength = data['filmLength']
        film_type = data['type']
        film_countries = data['countries']
        film_ratingAgeLimits = data['ratingAgeLimits']
        if film_ratingAgeLimits is not None:
            film_ratingAge = film_ratingAgeLimits.replace('age', '')
        else:
            film_ratingAge = None    
        film_ratingMpaa = data['ratingMpaa']
        film_ratingKinopoisk = data['ratingKinopoisk']
        film_ratingKinopoiskCount = data['ratingKinopoiskVoteCount']
        country_list = []
        for i in range(len(film_countries)):
            country = film_countries[i]['country']
            country_list.append(country)
        film_genres = data['genres']
        genre_list = []
        for i in range(len(film_genres)):
            genre = film_genres[i]['genre']
            genre_list.append(genre)
        film_poster_url = data['posterUrl']
        response_video = requests.get(url_video, headers=headers)
        time.sleep(1)
        data_video = response_video.json()['items']
        if data_video:
            films_trailer = data_video[0]['url']
        else:
            films_trailer = ''
        list_staff = response_staff.json()
        actors_list = []
        directors_list = []
        for i in range(len(list_staff)):
            professionKey = list_staff[i]['professionKey']
            if professionKey == 'ACTOR':
                actor_staffId =  list_staff[i]['staffId']
                
                actors_list.append(actor_staffId)
            if professionKey == 'DIRECTOR':
                director_staffId =  list_staff[i]['staffId']
                directors_list.append(director_staffId)   
        films_info_card = [film_id, 
                            film_name_ru, 
                            film_name_en, 
                            film_web_url, 
                            film_year, 
                            film_filmLength, 
                            film_type, 
                            country_list, 
                            genre_list, 
                            film_poster_url, 
                            film_shortDescription,
                            film_ratingAge,
                            film_ratingKinopoisk,
                            film_ratingKinopoiskCount,
                            film_ratingMpaa, 
                            films_trailer,
                            actors_list, 
                            directors_list]
        total_list.append(films_info_card)
        print(total_list)
        update_film_db(total_list, 'films_api')
        for actor in actors_list:
            get_person(actor)
        for director in directors_list:
            get_person(director)    

    except requests.exceptions.RequestException as e:
        print(f"Страницы не существует", e)
        pass
def main():
    start = time.time()
    films_id = 1150
    while films_id != 1200:
        get_films(films_id)
        print(f"Страница {films_id} спаршена")
        films_id += 1
    end = time.time()
    total = round((end-start)/60, 1)
    print('Время выполнения парса =', total , 'минут')
if __name__ == "__main__":
    main()
