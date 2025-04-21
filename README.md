# Desafio-Anlix

---



## Instructions:

* Make sure you have Docker installed and running
* Make sure you have docker-compose installed and avaible on a terminal
* Clone the project
* Open the root folder ("desafio-anlix") on your preferred terminal
* Run the command `docker-compose up -d --build`
* Go to the URL "[http://localhost:4200](http://localhost:4200 "Website for desafio-anlix")"

You can contact me about any doubts you have.

My informations are on the end of this README.

## Front-end

The front-end was made with Angular v19.

This choice was made for I was more experienced in it and also would be easier to make something decent.

## Back-end

The back-end framwork used was flask, I admit I knew nothing about it until starting to do this project.

The choice for using Flask was because the only other back-end framework I had contact with was Laravel and I didn't know If I wwould be able to remember how to use it in time for the deadline. So as I am used to developing in python I thought learning flask on-the-go was the way-to-go.

## Database

For the database I used mysql. To do that I converted the files you gave me to sql and used them to seed the DB.

To convert the files into a .sql file I used:

* For the JSON "pacientes" -> the website "[https://table.studio/convert/json/to/sql](https://table.studio/convert/json/to/sql "Site used to convert .json into .sql")" (For the record: I wouldn't use a website to this this if the data was real)
* For the other extensionless files: I coded a python program to do that for me it is named "ajuda.py" and can be found on the "other" folder.

I had to tinker a bit with the files so they would contain the, more or less, right types for each of the columns and other configurations.

### phpMyAdmin

I installed it on the docker also to make it easier to look at the database's tables.

You can access it by going to the URL: "[http://localhost:8090](http://localhost:8090 "phpMyAdmin")"
