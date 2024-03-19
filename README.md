<!-- This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ... -->

# **README**

## **About**

Admired Leadership is a LMS, where users are able to purchase it's content initially through full purchase then can choose to subscribe annually.
Breakdown of offered content:

- Modules are made up of selected Behaviors.
- Each Behavior consists of a video, audio, behavior map, examples, discussion questions, and exercises.

### Technologies

- RoR — BE & FE
- React — FE
- PSQL — DB
- DigitalOcean — hosting DBs and sites

---

### **Getting Started**

#### Database Set up

1. Install [PostgreSQL App](https://postgresapp.com/) and [pgAdmin 4](https://www.pgadmin.org/download/pgadmin-4-macos/)
2. In your terminal, run `ssh admired-leadership` to access project's remote server.
   - If it prompts you to add PW, retrieve it from "sudo password" under Developer fault in 1PW
   - If you do not have access, ask another developer to add your SSH key in `~/.ssh/authorized_keys`
3. To make copy of the latest database from prod, in the server, run
   `pg_dump postgresql://doadmin:sr2efv5zn3e11rzo@cra-db-1-do-user-6064751-0.db.ondigitalocean.com:25060/defaultdb -f ~/admired_leadership_production_yyyy-mm-dd.sql` (populate current date).
4. If you `ls` in the current directory, you should see the new sql file you've created.
5. `exit` out of server and run
   `rsync admired-leadership:admired_leadership_production_yyyy-mm-dd.sql ~/Downloads/.`
   This will make a copy of the file from the remote server to your `~/Downloads` directory.
6. Run PostgreSQL and pgAdmin4 Apps. Retrieve pgAdmin4 PW from 1PW under "pgadmin"
7. Create new database in pgAdmin4 and name it "admired_leadership_development".
8. Return to terminal and run
   `psql admired_leadership_development < ~/Downloads/admired_leadership_production_yyyy-mm-dd.sql`
   This will restore the `admired_leadership_development` DB with the sql file we copied from the server.

#### Application Set up

1. Clone project locally, pull latest from master, and run `bundle install` and `yarn install` from the root directory.
2. Run `bin/rails s` to start up server. Should now see project running in `localhost:3000`
3. In a separate terminal, `open ~/.zshrc` and add
   ```
   export FONT_AWESOME_TOKEN="ENTER HERE"
   ```
   Retrieve the token from [Font Awesome Accounts](https://fontawesome.com/account). Login credentials are in 1PW.
4. Ensure that pgAdmin4 is running with the databases accessed (by entering PW) and PostgreSQL is running on port 5432 with `admired_leadership_development` running inside. Make sure the app is running with `bin/rails s`. To test that the app is running properly, access the console from another terminal by running `bin/rails c`. Once inside, run `Users.all[0]`. If you get a user data back, then everything is running.

#### Trouble installing Ruby via RVM?
Amy had luck following these commands when having the following error:  `Error running '__rvm_make -j8'`:

```
brew uninstall gnupg gnutls libevent unbound wget
brew uninstall --ignore-dependencies openssl@3
RUBY_CONFIGURE_OPTS=--with-openssl-dir=/opt/homebrew/opt/openssl@1.1 rvm install 3.0.0
brew install gnupg gnutls libevent unbound wget
```

### **Deployment**

- Only `master` can push to prod with `bundle exec cap production deploy`
- Only `env/staging` can push to staging with `bundle exec cap staging deploy`
  **NOTE: All changes should funnel through `env/staging` before merging into `master`**
