Steps taken for deployment at heroku:

- Create app using UI
- Overview tab -> Configure add-ons -> ClearDB MySQL
- Settings tab -> Reveal Config Vars -> Set `mysql2://` on `CLEARDB_DATABASE_URL` 
- `$ heroku git:remote -a pocket-stars-mvp # or -v2`
- `$ git push heroku main`
- `$ heroku run 'rake db:setup'`