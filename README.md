# Desafio-Anlix

## Instructions:

* Make sure you have Docker installed and running
* Make sure you have docker-compose installed and avaible on a terminal
* Clone the project
* Open the root folder ("desafio-anlix") on your preferred terminal
* Run the command `docker-compose up -d --build`
* Go to the URL "[http://localhost:4200](http://localhost:4200 "Website for desafio-anlix")"

You can contact me about any doubts you have.

My contact informations are on the end of this README.

## Some Observations:

All the requirements are there now!

With some more time I would take my time finishing all the basic requirements and then proceed to expand the project, things I couldn't do but was planning on doing when I started:

* Making a decent environment with .env files and radom keys/APIkeys so the passwords aren't all public.
* Encrypting the passwords on the db and making AUTH routes, so we can login/logoff.
* Making routes to insert new lines into the DB, as new patients and new "indices pulmonares/cardíacos"
* Making improvements to some pages like creating a filter for the page with all the patients, their "indices" between two dates.
* Pagination made on the backend instead of on the front end so the querys wont return datas so big.
* Make the pages good to vizualize in smartphone mode with some responsiveness changes/additions on the css and html parts (like @media on css, 'hamburguer menu' + sidenav on html...)
* And unit testing that, I must admit, I still have to study much more.

Another thing that I should state here: I'm not the graphics design guy, I know my way making a page exactly like I (or someone else) want it to look but I don't have the talent to imagine a pretty website by myself.

**Apart from the commit to complete this README all of my commits on the MASTER branch were before tuesday (23/04/25) 23:59:59. BUT I fixed some things after midnight, those commits are on the auxBranch branch, all of them were made before 00:30.**

## Front-end

The front-end was made with Angular v19.

This choice was made for I was more experienced in it and also would be easier to make something decent.

## Back-end

The back-end framwork used was flask, I admit I knew nothing about it until starting to do this project.

The choice for using Flask was because the only other back-end framework I had contact with was Laravel and I didn't know If I would be able to remember how to use it in time for the deadline. So as I am used to developing in python I thought learning flask on-the-go was the way-to-go.

I thought it would be easier to use for a short project too.

## Database

For the database I used mysql. To do that I converted the files you gave me to sql and used them to seed the DB.

To convert the files into a .sql file I used:

* For the JSON "pacientes" -> the website "[https://table.studio/convert/json/to/sql](https://table.studio/convert/json/to/sql "Site used to convert .json into .sql")" (For the record: I wouldn't use a website to this this if the data was real)
* For the other extensionless files: I coded a python program to do that for me it is named "ajuda.py" and can be found on the "other" folder.

I had to tinker a bit with the files so they would contain the, more or less, right types for each of the columns and other configurations.

### phpMyAdmin

I installed it on the docker also to make it easier to look at the database's tables.

You can access it by going to the URL: "[http://localhost:8090](http://localhost:8090 "phpMyAdmin")"

## NGINX

Used it to make a reverse proxy and 'dodge' CORS Problems.

## Contact

* Telegram: [@Yuujin_A](t.me/Yuujin_A)
* Whatsapp: [(24) 9 8803-7543](https://wa.me/+5524988037543)
* Linkedin: [Gabriel Conde](https://www.linkedin.com/in/gabriel-conde-9b5334190/)
* E-mail: [gabriel.wave.conde@gmail.com](mailto:gabriel.wave.conde@gmail.com)
